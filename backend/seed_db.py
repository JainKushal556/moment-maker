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
        "welcome_bonus": 10,
        "ref_signup_bonus": 20,
        "referral_reward": 300,
        "daily_bonus": 5,
        "default_template_price": 0
    }
    config_ref.set(config_data)
    print("Seeded app_config/wishbit_settings")

    # 2. Template Info (Prices)
    templates = [
        {"id": "birthday-mosaic", "price": 0},
        {"id": "chic-complement", "price": 0},
        {"id": "pearl-glow-birthday", "price": 0},
        {"id": "charming-proposal", "price": 0},
        {"id": "imperial-friendship", "price": 0},
        {"id": "missing-motif", "price": 0}
    ]

    for t in templates:
        t_ref = db.collection("templates_info").document(t["id"])
        t_ref.set({"price": t["price"]}, merge=True)
        print(f"Seeded price for {t['id']}: {t['price']}")

    print("\nSeeding Complete! Your Wishbit system is ready.")

if __name__ == "__main__":
    seed_data()
