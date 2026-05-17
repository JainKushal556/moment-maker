import random
import string
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from firebase_admin import firestore
from core.security import get_current_user

router = APIRouter(prefix="/users", tags=["users"])
db = firestore.client()

def generate_referral_code(length=6):
    """Generate a unique 6-character alphanumeric referral code."""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@firestore.transactional
def get_or_create_referral_code(transaction, user_id):
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
    photo_url = user.get("picture")
    
    user_ref = db.collection("users").document(uid)
    
    # Check if already initialized to prevent double-claiming
    user_doc = user_ref.get()
    if user_doc.exists and user_doc.to_dict().get("initialized", False):
        return {"status": "already_initialized"}

    # Fetch rewards from config
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {
        "welcome_bonus": 500,
        "ref_signup_bonus": 200,
        "referral_reward": 300
    }
    
    welcome_bonus = config.get("welcome_bonus", 500)
    ref_signup_bonus = config.get("ref_signup_bonus", 200)
    referral_reward = config.get("referral_reward", 300)

    @firestore.transactional
    def process_initialization(transaction, user_ref, payload, uid, email, display_name, photo_url, welcome_bonus, ref_signup_bonus, referral_reward):
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
                        actual_signup_bonus = welcome_bonus + ref_signup_bonus
                        referred_by = referrer_uid
                        
                        # Add to referrer's referrals sub-collection as PENDING
                        referral_entry_ref = referrer_ref.collection("referrals").document(uid)
                        transaction.set(referral_entry_ref, {
                            "uid": uid,
                            "displayName": display_name or "New Friend",
                            "status": "pending",
                            "wishbits": referral_reward,
                            "timestamp": firestore.SERVER_TIMESTAMP
                        })

        # 3. Create new user data (Initial Balance is 0, rewards must be claimed)
        new_user_data = {
            "uid": uid,
            "email": email,
            "displayName": display_name,
            "photoURL": photo_url,
            "wishbits": 0, # Starts at 0
            "unlockedTemplates": [],
            "referredBy": referred_by,
            "initialized": True,
            "isReferred": is_referred, # Store for claiming logic
            "claimedOneTime": [], # List of claimed IDs
            "claimedMilestones": [], # List of claimed milestone counts
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        
        # Save new user data
        transaction.set(user_ref, new_user_data, merge=True)

        # Return clean data
        return {
            "uid": uid,
            "wishbits": 0,
            "streakCount": 1,
            "claimedDays": [],
            "unlockedTemplates": [],
            "claimedOneTime": [],
            "claimedMilestones": [],
            "isReferred": is_referred
        }

    try:
        # 1. Process main initialization (Signup bonus, referral link)
        data = process_initialization(db.transaction(), user_ref, payload, uid, email, display_name, photo_url, welcome_bonus, ref_signup_bonus, referral_reward)
        
        # 2. Generate/Get unique referral code for the new user
        my_code = get_or_create_referral_code(db.transaction(), uid)
        data["referralCode"] = my_code
        
        return {
            "success": True,
            "message": "User initialized successfully",
            "data": data
        }
    except Exception as e:
        print(f"Initialization Failed for {uid}: {str(e)}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail="Failed to initialize user")

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
    
    # 1. Get default price from config
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {}
    default_price = config.get("default_template_price", 100)
    
    # 2. Check if template exists and get specific price
    t_doc = template_ref.get()
    if not t_doc.exists:
        price = default_price
    else:
        price = t_doc.to_dict().get("price", default_price)

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
        
        # Log Transaction (Universal Schema)
        tx_ref = user_ref.collection("transactions").document()
        txn_id = tx_ref.id
        description = f"Unlocked premium template: {t_id.replace('-', ' ').title()}"
        
        transaction.set(tx_ref, {
            "txnId": txn_id,
            "type": "DEBIT",
            "category": "TEMPLATE_PURCHASE",
            "amount": price,
            "paymentId": None,
            "description": description,
            "status": "COMPLETED",
            "metadata": {
                "templateId": t_id,
                "price": price
            },
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {"new_balance": new_bits, "templateId": t_id}

    try:
        result = process_unlock(db.transaction(), user_ref, t_id, price, uid)
        if result.get("status") == "already_unlocked":
            return {"success": False, "message": "Template already unlocked"}
            
        return {
            "success": True,
            "message": "Template unlocked successfully",
            "data": result
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Unlock error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to unlock template")

@router.post("/daily-claim")
async def claim_daily_reward(day_to_claim: int = Body(..., embed=True), user: dict = Depends(get_current_user)):
    """
    Manually claim a specific day's reward from the streak.
    - Day 2, 5: Only claimable if streakCount > day (i.e., from next day onwards).
    - Prevents double-claiming the same day in the same streak.
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    config_ref = db.collection("app_config").document("wishbit_settings")
    
    @firestore.transactional
    def process_claim(transaction, user_ref, config_ref, day):
        u_doc = user_ref.get(transaction=transaction)
        if not u_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")
            
        u_data = u_doc.to_dict()
        config = config_ref.get(transaction=transaction).to_dict() or {"daily_bonus": 5}
        base_reward = config.get("daily_bonus", 5)
        
        today = datetime.now(timezone.utc).date()
        today_str = today.strftime("%Y-%m-%d")
        
        last_login_date_str = u_data.get("lastLoginDate")
        streak = u_data.get("streakCount", 0)
        claimed_days = u_data.get("claimedDays", [])
        current_bits = u_data.get("wishbits", 0)

        # 1. Validation for the specific day
        if day < 1 or day > 7:
            raise HTTPException(status_code=400, detail="Invalid day.")
        
        if day > streak:
            raise HTTPException(status_code=400, detail="Day not reached yet. Please login on that day first.")
            
        if day in claimed_days:
            raise HTTPException(status_code=400, detail="Day already claimed.")
            
        # 2. Deferred Rule (Day 2 and 5)
        if day in [2, 5] and streak == day:
             raise HTTPException(status_code=400, detail=f"Day {day} reward is pending. Claim it on Day {day+1}!")

        # 3. Calculate Reward
        reward = base_reward * 2 if day == 7 else base_reward
        
        # 4. Update State
        claimed_days.append(day)
        new_bits = current_bits + reward
        
        updates = {
            "claimedDays": claimed_days,
            "wishbits": new_bits
        }
        
        # 5. Log Transaction (Universal Schema)
        tx_ref = user_ref.collection("transactions").document()
        txn_id = tx_ref.id
        description = f"Daily login reward for day {day}"
        if day == 7:
            description = "Final 7-day streak completion bonus"
            
        transaction.set(tx_ref, {
            "txnId": txn_id,
            "type": "CREDIT",
            "category": "STREAK_REWARD",
            "amount": reward,
            "paymentId": None,
            "description": description,
            "status": "COMPLETED",
            "metadata": {
                "day": day,
                "streakCount": streak
            },
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        transaction.update(user_ref, updates)
        return {"new_balance": new_bits, "streak": streak, "claimedDays": claimed_days}

    try:
        # Execute the transactional function
        result = process_claim(db.transaction(), user_ref, config_ref, day_to_claim)
        return {
            "success": True,
            "message": "Daily reward claimed successfully",
            "data": result
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Claim execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/claim-one-time")
async def claim_one_time_reward(reward_type: str = Body(..., embed=True), user: dict = Depends(get_current_user)):
    """
    Claim a one-time reward (WELCOME_BONUS or REFERRAL_SIGNUP).
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {"welcome_bonus": 10, "ref_signup_bonus": 20}
    
    @firestore.transactional
    def process_one_time_claim(transaction, user_ref, reward_type):
        u_doc = user_ref.get(transaction=transaction)
        if not u_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")
            
        u_data = u_doc.to_dict()
        claimed = u_data.get("claimedOneTime", [])
        
        if reward_type in claimed:
            raise HTTPException(status_code=400, detail="Reward already claimed.")
            
        # Eligibility Checks
        amount = 0
        description = ""
        category = reward_type
        
        if reward_type == "WELCOME_BONUS":
            amount = config.get("welcome_bonus", 10)
            description = "Welcome bonus for joining"
        elif reward_type == "REFERRAL_SIGNUP":
            if not u_data.get("isReferred"):
                raise HTTPException(status_code=400, detail="Not eligible for referral bonus.")
            
            # SECURITY RULE: Must have shared at least one template
            shared_moments = db.collection("moments").where(filter=firestore.FieldFilter("uid", "==", uid)).where(filter=firestore.FieldFilter("status", "==", "shared")).limit(1).get()
            if not shared_moments:
                raise HTTPException(status_code=400, detail="You must create and share at least one template to unlock this bonus.")
                
            amount = config.get("ref_signup_bonus", 20)
            description = "Referral signup bonus"
        else:
            raise HTTPException(status_code=400, detail="Invalid reward type.")
            
        # Update State
        current_bits = u_data.get("wishbits", 0)
        new_bits = current_bits + amount
        claimed.append(reward_type)
        
        transaction.update(user_ref, {
            "wishbits": new_bits,
            "claimedOneTime": claimed
        })
        
        # Log Transaction
        tx_ref = user_ref.collection("transactions").document()
        transaction.set(tx_ref, {
            "txnId": tx_ref.id,
            "type": "CREDIT",
            "category": category,
            "amount": amount,
            "paymentId": None,
            "description": description,
            "status": "COMPLETED",
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {"new_balance": new_bits, "claimedOneTime": claimed}

    try:
        result = process_one_time_claim(db.transaction(), user_ref, reward_type)
        return {
            "success": True,
            "message": f"{reward_type} claimed successfully",
            "data": result
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"One-time claim error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to claim reward")


@router.post("/claim-referral")
async def claim_referral_reward(friend_uid: str = Body(..., embed=True), user: dict = Depends(get_current_user)):
    """
    Manually claim a pending referral reward from the 'referrals' sub-collection.
    """
    uid = user["uid"]
    # Fetch rewards from config
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {}
    referral_reward = config.get("referral_reward", 300)

    user_ref = db.collection("users").document(uid)
    friend_ref = user_ref.collection("referrals").document(friend_uid)
    
    @firestore.transactional
    def process_claim(transaction, user_ref, friend_ref, referral_reward):
        friend_doc = friend_ref.get(transaction=transaction)
        if not friend_doc.exists:
            raise HTTPException(status_code=404, detail="Referral record not found.")
            
        friend_data = friend_doc.to_dict()
        if friend_data.get("status") != "pending":
            raise HTTPException(status_code=400, detail="Referral reward already claimed or not pending.")
            
        # SECURITY RULE: Referrer can only claim if friend has claimed their signup bonus
        friend_uid = friend_data.get("uid")
        actual_friend_doc = db.collection("users").document(friend_uid).get(transaction=transaction)
        if not actual_friend_doc.exists:
            raise HTTPException(status_code=404, detail="Friend user record not found")
            
        friend_user_data = actual_friend_doc.to_dict()
        friend_claimed = friend_user_data.get("claimedOneTime", [])
        if "REFERRAL_SIGNUP" not in friend_claimed:
            raise HTTPException(status_code=400, detail="You can only claim this reward after your friend has claimed their signup bonus.")

        reward_amount = friend_data.get("wishbits", referral_reward)
        
        # 1. Update Referrer's balance
        user_doc = user_ref.get(transaction=transaction)
        current_bits = user_doc.to_dict().get("wishbits", 0)
        new_bits = current_bits + reward_amount
        
        transaction.update(user_ref, {"wishbits": new_bits})
        
        # 2. Mark referral as claimed
        transaction.update(friend_ref, {"status": "claimed"})
        
        # 3. Log Transaction
        tx_ref = user_ref.collection("transactions").document()
        transaction.set(tx_ref, {
            "txnId": tx_ref.id,
            "type": "CREDIT",
            "category": "REFERRAL_REWARD",
            "amount": reward_amount,
            "paymentId": None,
            "description": f"Claimed referral reward for {friend_data.get('displayName', 'a friend')}",
            "status": "COMPLETED",
            "metadata": {
                "referredUid": friend_uid,
                "referredName": friend_data.get("displayName")
            },
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {"new_balance": new_bits}

    try:
        result = process_claim(db.transaction(), user_ref, friend_ref, referral_reward)
        return {
            "success": True,
            "message": "Referral reward claimed successfully",
            "data": result
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Referral claim error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to claim referral reward")


@router.post("/claim-milestone")
async def claim_milestone_reward(count: int = Body(..., embed=True), user: dict = Depends(get_current_user)):
    """
    Claim a milestone reward.
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    config_ref = db.collection("app_config").document("wishbit_settings")
    
    @firestore.transactional
    def process_milestone_claim(transaction, user_ref, config_ref, count):
        u_doc = user_ref.get(transaction=transaction)
        if not u_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")
            
        u_data = u_doc.to_dict()
        claimed = u_data.get("claimedMilestones", [])
        
        if count in claimed:
            raise HTTPException(status_code=400, detail="Milestone already claimed.")
            
        # Count actual referrals
        referrals_docs = user_ref.collection("referrals").stream(transaction=transaction)
        actual_referrals = len(list(referrals_docs))
        
        if actual_referrals < count:
            raise HTTPException(status_code=400, detail="Milestone not reached yet.")
            
        config = config_ref.get(transaction=transaction).to_dict() or {}
        unit_reward = config.get("milestone_unit_reward", 50)
        
        reward_amount = count * unit_reward
        current_bits = u_data.get("wishbits", 0)
        new_bits = current_bits + reward_amount
        claimed.append(count)
        
        transaction.update(user_ref, {
            "wishbits": new_bits,
            "claimedMilestones": claimed
        })
        
        # Log Transaction
        tx_ref = user_ref.collection("transactions").document()
        transaction.set(tx_ref, {
            "txnId": tx_ref.id,
            "type": "CREDIT",
            "category": "REFERRAL_MILESTONE_REWARD",
            "amount": reward_amount,
            "paymentId": None,
            "description": f"Claimed {count} friends referral milestone reward",
            "status": "COMPLETED",
            "metadata": {
                "milestoneCount": count
            },
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {"new_balance": new_bits, "claimedMilestones": claimed}

    try:
        result = process_milestone_claim(db.transaction(), user_ref, config_ref, count)
        return {
            "success": True,
            "message": "Milestone claimed successfully",
            "data": result
        }
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Milestone claim error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to claim milestone reward")


@router.get("/me")
async def get_my_profile(user: dict = Depends(get_current_user)):
    """
    Fetch the authenticated user's Wishbit profile.
    Updated: Now only records 'lastLoginDate' if it's a new day, but doesn't grant bonus automatically.
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    
    # 1. Fetch User Data
    user_doc = user_ref.get()
    if not user_doc.exists:
        # Initialize if not exists, then re-fetch to get full object
        await initialize_user(InitPayload(referralCode=None), user)
        user_doc = user_ref.get()
    
    user_data = user_doc.to_dict()
    
    # 2. Self-healing for referral codes
    if not user_data.get("referralCode"):
        transaction_code = db.transaction()
        my_code = get_or_create_referral_code(transaction_code, uid)
        user_data["referralCode"] = my_code
    
    # 3. Handle 'lastLoginDate' and Streak Reset (Passive Check)
    today = datetime.now(timezone.utc).date()
    today_str = today.strftime("%Y-%m-%d")
    last_login_date_str = user_data.get("lastLoginDate")
    streak = user_data.get("streakCount", 0)
    
    if last_login_date_str != today_str:
        if last_login_date_str:
            last_login = datetime.strptime(last_login_date_str, "%Y-%m-%d").date()
            diff = (today - last_login).days
            
            if diff == 1:
                # Consecutive day! Increment streak
                if streak >= 7:
                    streak = 1
                    user_data["claimedDays"] = []
                else:
                    streak += 1
            elif diff > 1:
                # Streak broken! Reset
                streak = 1
                user_data["claimedDays"] = []
        else:
            # First time ever
            streak = 1
            user_data["claimedDays"] = []
        
        # Update Database with new login state
        user_ref.update({
            "streakCount": streak,
            "lastLoginDate": today_str,
            "claimedDays": user_data.get("claimedDays", [])
        })
        user_data["streakCount"] = streak
        user_data["lastLoginDate"] = today_str

    # Fetch Config for UI display
    config_ref = db.collection("app_config").document("wishbit_settings")
    config = config_ref.get().to_dict() or {}
    daily_bonus = config.get("daily_bonus", 5)
    welcome_bonus = config.get("welcome_bonus", 500)
    ref_signup_bonus = config.get("ref_signup_bonus", 200)
    referral_reward = config.get("referral_reward", 300)
    milestone_unit_reward = config.get("milestone_unit_reward", 50)

    # 4. Fetch referrals list efficiently
    referrals_docs = user_ref.collection("referrals").order_by("timestamp", direction=firestore.Query.ASCENDING).stream()
    temp_referrals = []
    friend_uids = []
    
    for doc in referrals_docs:
        ref_data = doc.to_dict()
        ref_data["id"] = doc.id
        ref_data["initial"] = ref_data.get("displayName", "?")[0].upper()
        temp_referrals.append(ref_data)
        if ref_data.get("uid"):
            friend_uids.append(ref_data.get("uid"))

    # Batch fetch all friend documents
    friend_docs_dict = {}
    if friend_uids:
        friend_refs = [db.collection("users").document(uid) for uid in friend_uids]
        # Firestore get_all returns documents in order of refs
        actual_docs = db.get_all(friend_refs)
        for doc in actual_docs:
            if doc.exists:
                friend_docs_dict[doc.id] = doc.to_dict()

    # Finalize referral list with claim status
    referrals_list = []
    claimed_total = 0
    pending_total = 0
    
    for ref_data in temp_referrals:
        f_uid = ref_data.get("uid")
        f_data = friend_docs_dict.get(f_uid, {})
        f_claimed_list = f_data.get("claimedOneTime", [])
        
        # Merge profile info
        ref_data["displayName"] = f_data.get("displayName") or ref_data.get("displayName", "New Friend")
        ref_data["photoURL"] = f_data.get("photoURL")
        ref_data["friendClaimed"] = "REFERRAL_SIGNUP" in f_claimed_list
        
        # Calculate initial
        name = ref_data["displayName"]
        ref_data["initial"] = name[0].upper() if name else "F"
        
        referrals_list.append(ref_data)
        
        if ref_data.get("status") == "claimed":
            claimed_total += ref_data.get("wishbits", referral_reward)
        else:
            pending_total += ref_data.get("wishbits", referral_reward)

    # 4. Final state for response
    claimed_one_time = user_data.get("claimedOneTime", [])
    is_referred = user_data.get("isReferred", False)
    user_data["claimedOneTime"] = claimed_one_time

    # 5. Fetch transactions list (Initial limited load)
    tx_docs = user_ref.collection("transactions").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(5).get()
    tx_list = []
    for doc in tx_docs:
        tx_data = doc.to_dict()
        tx_data["id"] = doc.id
        
        # Convert Firestore timestamp to ISO string for frontend localization
        if "timestamp" in tx_data and tx_data["timestamp"]:
            try:
                tx_data["timestamp"] = tx_data["timestamp"].isoformat()
            except Exception:
                pass
        
        tx_list.append(tx_data)

    return {
        "success": True,
        "message": "Profile fetched successfully",
        "data": {
            "wishbits": user_data.get("wishbits", 0),
            "streakCount": user_data.get("streakCount", 0),
            "claimedDays": user_data.get("claimedDays", []),
            "dailyBonus": daily_bonus,
            "welcomeBonus": welcome_bonus,
            "refSignupBonus": ref_signup_bonus,
            "referralBonus": referral_reward,
            "milestoneUnitReward": milestone_unit_reward,
            "referralCode": user_data.get("referralCode", ""),
            "unlockedTemplates": user_data.get("unlockedTemplates", []),
            "referredBy": user_data.get("referredBy"),
            "isReferred": user_data.get("isReferred", False),
            "claimedOneTime": user_data.get("claimedOneTime", []),
            "claimedMilestones": user_data.get("claimedMilestones", []),
            "hasSharedTemplate": db.collection("moments").where(filter=firestore.FieldFilter("uid", "==", uid)).where(filter=firestore.FieldFilter("status", "==", "shared")).limit(1).get() != [],
            "referrals": referrals_list,
            "transactions": tx_list,
            "pendingTotal": pending_total,
            "claimedTotal": claimed_total
        }
    }


@router.get("/me/transactions")
async def get_user_transactions(
    limit: int = 5, 
    last_id: str | None = None, 
    user: dict = Depends(get_current_user)
):
    """
    Fetch paginated transactions for the current user.
    """
    uid = user["uid"]
    user_ref = db.collection("users").document(uid)
    tx_ref = user_ref.collection("transactions").order_by("timestamp", direction=firestore.Query.DESCENDING)
    
    if last_id:
        last_doc_ref = user_ref.collection("transactions").document(last_id).get()
        if last_doc_ref.exists:
            tx_ref = tx_ref.start_after(last_doc_ref)
            
    tx_docs = tx_ref.limit(limit).get()
    
    tx_list = []
    for doc in tx_docs:
        tx_data = doc.to_dict()
        tx_data["id"] = doc.id
        if "timestamp" in tx_data and tx_data["timestamp"]:
            try:
                tx_data["timestamp"] = tx_data["timestamp"].isoformat()
            except Exception:
                pass
        tx_list.append(tx_data)
        
    return {
        "success": True,
        "data": {
            "transactions": tx_list,
            "hasMore": len(tx_list) == limit
        }
    }
