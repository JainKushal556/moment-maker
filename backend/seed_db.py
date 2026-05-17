import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin
key_path = "serviceAccountKey.json"
if not os.path.exists(key_path):
    print(f"Error: {key_path} not found. Please ensure it exists in the backend directory.")
    exit(1)

cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

def seed_data():
    print("Seeding Moment Maker Database...")

    # 1. Global Settings
    config_ref = db.collection("app_config").document("wishbit_settings")
    config_data = {
        "welcome_bonus": 500,
        "ref_signup_bonus": 200,
        "referral_reward": 300,
        "daily_bonus": 50,
        "milestone_unit_reward": 50,
        "default_template_price": 0
    }
    config_ref.set(config_data)
    print("Seeded app_config/wishbit_settings")

    # 2. Template Info (Prices)
    templates = [
        {"id": "birthday-mosaic", "price": 0},
        {"id": "chic-compliment", "price": 499},
        {"id": "pearl-glow-birthday", "price": 1499},
        {"id": "charming-proposal", "price": 499},
        {"id": "imperial-friendship", "price": 0},
        {"id": "missing-motif", "price": 499},
        {"id": "cherry-blossom-proposal", "price": 0},
        {"id": "heartfelt-remembrance", "price": 0}
    ]

    for t in templates:
        t_ref = db.collection("templates_info").document(t["id"])
        t_ref.set({"price": t["price"]}, merge=True)
        print(f"Seeded price for {t['id']}: {t['price']}")

    print("\nSeeding Complete! Your Wishbit system is ready.")

if __name__ == "__main__":
    seed_data()
