import random
import string
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from firebase_admin import firestore
from core.security import get_current_user

router = APIRouter(prefix="/users", tags=["users"])
db = firestore.client()

def generate_referral_code(length=6):
    """Generate a unique 6-character alphanumeric referral code."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

async def get_or_create_referral_code(transaction, user_id):
    """
    Transactional function to ensure a user has a unique referral code.
    Checks 'users' collection first, then 'referral_codes' for uniqueness.
    """
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get(transaction=transaction)
    
    if user_doc.exists and "referralCode" in user_doc.to_dict():
        return user_doc.to_dict()["referralCode"]

    # Generate and verify uniqueness
    max_retries = 5
    for _ in range(max_retries):
        new_code = generate_referral_code()
        code_ref = db.collection("referral_codes").document(new_code)
        code_doc = code_ref.get(transaction=transaction)
        
        if not code_doc.exists:
            # Code is unique!
            transaction.set(code_ref, {"uid": user_id})
            transaction.update(user_ref, {"referralCode": new_code})
            return new_code
            
    raise HTTPException(status_code=500, detail="Failed to generate a unique referral code.")

class InitPayload(BaseModel):
    referralCode: str | None = None

@router.post("/initialize")
async def initialize_user(payload: InitPayload, user: dict = Depends(get_current_user)):
    """
    Initialize a new user profile.
    - Grants signup bonus.
    - Processes referral code if provided.
    - Generates a unique referral code for the new user.
    """
    uid = user["uid"]
    email = user.get("email")
    display_name = user.get("name")
    
    user_ref = db.collection("users").document(uid)
    
    # Check if already initialized to prevent double-claiming
    user_doc = user_ref.get()
    if user_doc.exists and user_doc.to_dict().get("initialized", False):
        return {"status": "already_initialized"}

    # Fetch rewards from config
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {
        "welcome_bonus": 10,
        "ref_signup_bonus": 20,
        "referral_reward": 50
    }
    
    welcome_bonus = config.get("welcome_bonus", 10)
    ref_signup_bonus = config.get("ref_signup_bonus", 20)
    referral_reward = config.get("referral_reward", 50)

    @firestore.transactional
    def process_initialization(transaction, user_ref, payload, uid, welcome_bonus, ref_signup_bonus, referral_reward):
        # 1. Default setup (Normal signup)
        actual_signup_bonus = welcome_bonus
        referred_by = None
        is_referred = False
        
        # 2. Handle Referral
        if payload.referralCode:
            clean_code = payload.referralCode.strip().upper()
            print(f"Processing Referral Code: {clean_code} for user {uid}")
            
            # Find the owner of the code
            code_query = db.collection("referral_codes").document(clean_code).get(transaction=transaction)
            
            if code_query.exists:
                referrer_uid = code_query.to_dict()["uid"]
                
                # Prevent self-referral
                if referrer_uid != uid:
                    referrer_ref = db.collection("users").document(referrer_uid)
                    referrer_doc = referrer_ref.get(transaction=transaction)
                    
                    if referrer_doc.exists:
                        # Success! A valid referral occurred
                        is_referred = True
                        actual_signup_bonus = ref_signup_bonus
                        referred_by = referrer_uid
                        
                        # Credit Referrer
                        current_bits = referrer_doc.to_dict().get("wishbits", 0)
                        transaction.update(referrer_ref, {"wishbits": current_bits + referral_reward})
                        
                        # Add to referrer's referrals sub-collection
                        referral_entry_ref = referrer_ref.collection("referrals").document(uid)
                        transaction.set(referral_entry_ref, {
                            "uid": uid,
                            "displayName": display_name or "New Friend",
                            "status": "claimed",
                            "wishbits": referral_reward,
                            "date": datetime.now(timezone.utc).strftime("%d %b %Y")
                        })

                        # Log Transaction for Referrer
                        ref_tx_ref = referrer_ref.collection("transactions").document()
                        transaction.set(ref_tx_ref, {
                            "type": "credit",
                            "amount": referral_reward,
                            "label": f"Referral Reward: {display_name or 'New Friend'}",
                            "date": datetime.now(timezone.utc).strftime("%d %b %Y"),
                            "timestamp": firestore.SERVER_TIMESTAMP
                        })

        # 3. Create new user data
        new_user_data = {
            "uid": uid,
            "email": email,
            "displayName": display_name,
            "wishbits": actual_signup_bonus,
            "unlockedTemplates": [],
            "referredBy": referred_by,
            "initialized": True,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        
        # Save new user data
        transaction.set(user_ref, new_user_data, merge=True)

        # 4. Log Transaction for New User
        user_tx_ref = user_ref.collection("transactions").document()
        tx_label = "Referral Bonus ✨" if is_referred else "Welcome Bonus ✨"
        
        transaction.set(user_tx_ref, {
            "type": "credit",
            "amount": actual_signup_bonus,
            "label": tx_label,
            "date": datetime.now(timezone.utc).strftime("%d %b %Y"),
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return new_user_data

    transaction = db.transaction()
    user_data = process_initialization(transaction, user_ref, payload, uid, welcome_bonus, ref_signup_bonus, referral_reward)
    
    # 4. Generate unique referral code for the new user (separate transaction)
    transaction_code = db.transaction()
    my_code = get_or_create_referral_code(transaction_code, uid)
    
    return {
        "status": "success",
        "wishbits": user_data["wishbits"],
        "referralCode": my_code
    }

class UnlockPayload(BaseModel):
    templateId: str

@router.post("/unlock")
async def unlock_template(payload: UnlockPayload, user: dict = Depends(get_current_user)):
    """
    Unlock a premium template using Wishbits.
    """
    uid = user["uid"]
    t_id = payload.templateId
    
    user_ref = db.collection("users").document(uid)
    template_ref = db.collection("templates_info").document(t_id)
    
    # 1. Check if template exists and get price
    t_doc = template_ref.get()
    if not t_doc.exists:
        # If not in DB, use default price from config
        config_ref = db.collection("app_config").document("wishbit_settings")
        config = config_ref.get().to_dict() or {"default_template_price": 100}
        price = config.get("default_template_price", 100)
    else:
        price = t_doc.to_dict().get("price", 100)

    @firestore.transactional
    def process_unlock(transaction, user_ref, t_id, price, uid):
        user_doc = user_ref.get(transaction=transaction)
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")
            
        data = user_doc.to_dict()
        unlocked = data.get("unlockedTemplates", [])
        
        if t_id in unlocked:
            return {"status": "already_unlocked"}
            
        current_bits = data.get("wishbits", 0)
        
        if current_bits < price:
            raise HTTPException(status_code=400, detail="Insufficient Wishbits.")
            
        # Deduct bits and add template
        new_bits = current_bits - price
        unlocked.append(t_id)
        
        transaction.update(user_ref, {
            "wishbits": new_bits,
            "unlockedTemplates": unlocked
        })
        
        # Log Transaction
        tx_ref = user_ref.collection("transactions").document()
        transaction.set(tx_ref, {
            "type": "debit",
            "amount": price,
            "label": f"Unlocked Template: {t_id.replace('-', ' ').title()}",
            "date": datetime.now(timezone.utc).strftime("%d %b %Y"),
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {"status": "success", "new_balance": new_bits}

    transaction = db.transaction()
    return process_unlock(transaction, user_ref, t_id, price, uid)

@router.get("/me")
async def get_my_profile(user: dict = Depends(get_current_user)):
    """
    Fetch the authenticated user's Wishbit profile.
    Automatically grants a daily check-in bonus if it's a new day.
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    
    # 1. Fetch Config and User Data
    user_doc = user_ref.get()
    if not user_doc.exists:
        # Auto-initialize if first time hitting /me (safe fallback)
        return await initialize_user(InitPayload(referralCode=None), user)
    
    user_data = user_doc.to_dict()
    
    # 2. Check for Daily Bonus (Automatic)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    last_bonus_date = user_data.get("lastDailyBonusClaimed")
    
    if last_bonus_date != today_str:
        # Fetch Daily Reward Amount from Config
        config_ref = db.collection("app_config").document("wishbit_settings")
        config = config_ref.get().to_dict() or {"daily_bonus": 5}
        daily_reward = config.get("daily_bonus", 5)

        @firestore.transactional
        def process_daily_bonus(transaction, user_ref, today_str, daily_reward):
            u_doc = user_ref.get(transaction=transaction)
            u_data = u_doc.to_dict()
            
            # Double check inside transaction
            if u_data.get("lastDailyBonusClaimed") == today_str:
                return u_data
            
            current_bits = u_data.get("wishbits", 0)
            new_bits = current_bits + daily_reward
            
            transaction.update(user_ref, {
                "wishbits": new_bits,
                "lastDailyBonusClaimed": today_str
            })
            
            # Log Transaction
            tx_ref = user_ref.collection("transactions").document()
            transaction.set(tx_ref, {
                "type": "credit",
                "amount": daily_reward,
                "label": "Daily Reward 🎁",
                "date": datetime.now(timezone.utc).strftime("%d %b %Y"),
                "timestamp": firestore.SERVER_TIMESTAMP
            })
            
            u_data["wishbits"] = new_bits
            u_data["lastDailyBonusClaimed"] = today_str
            return u_data

        transaction = db.transaction()
        user_data = process_daily_bonus(transaction, user_ref, today_str, daily_reward)

    # 3. Fetch all template prices to help frontend show locks
    templates_docs = db.collection("templates_info").stream()
    template_prices = {doc.id: doc.to_dict().get("price", 100) for doc in templates_docs}
    
    # 4. Fetch referrals list
    referrals_docs = user_ref.collection("referrals").stream()
    referrals_list = []
    claimed_total = 0
    pending_total = 0
    
    for doc in referrals_docs:
        ref_data = doc.to_dict()
        ref_data["id"] = doc.id
        ref_data["initial"] = ref_data.get("displayName", "?")[0].upper()
        referrals_list.append(ref_data)
        
        if ref_data.get("status") == "claimed":
            claimed_total += ref_data.get("wishbits", 0)
        else:
            pending_total += ref_data.get("wishbits", 0)

    # 5. Fetch transactions list
    tx_docs = user_ref.collection("transactions").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(20).stream()
    tx_list = []
    for doc in tx_docs:
        tx_data = doc.to_dict()
        tx_data["id"] = doc.id
        if "timestamp" in tx_data: del tx_data["timestamp"]
        tx_list.append(tx_data)

    return {
        "wishbits": user_data.get("wishbits", 0),
        "referralCode": user_data.get("referralCode", ""),
        "unlockedTemplates": user_data.get("unlockedTemplates", []),
        "referredBy": user_data.get("referredBy"),
        "templatePrices": template_prices,
        "referrals": referrals_list,
        "claimedTotal": claimed_total,
        "pendingTotal": pending_total,
        "transactions": tx_list
    }
