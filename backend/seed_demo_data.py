import json
import random
from datetime import datetime, timedelta
from app import app, db, Issue, User

def seed_demo_data():
    with app.app_context():
        print("Seeding Massive Realistic Data (100+ Issues)...")
        
        # Get a user (create if needed for FK)
        user = User.query.first()
        if not user:
            print("No users found. Creating dummy admin for seeding.")
            from werkzeug.security import generate_password_hash
            user = User(username="admin", email="admin@fixity.com", password=generate_password_hash("admin"), role="authority")
            db.session.add(user)
            db.session.commit()

        # Load Odisha Data for realistic locations
        try:
            with open('data/odisha_data.json', 'r') as f:
                ODISHA_DATA = json.load(f)
        except FileNotFoundError:
            print("Error: odisha_data.json not found. Using fallback.")
            ODISHA_DATA = {"Khordha": ["Bhubaneswar", "Jatni"], "Cuttack": ["Cuttack Sadar", "Barang"]}

        # Configuration for randomization
        CATEGORIES = ["Pothole", "Water Leakage", "Garbage", "Traffic Violation", "Stray Animals", "Electricity"]
        CONTEXTS = ["residential", "school_zone", "hospital_zone", "highway", "market"]
        DISTRICT_CENTERS = {
            'Khordha': {'lat': 20.2961, 'lng': 85.8245},
            'Cuttack': {'lat': 20.4625, 'lng': 85.8828},
            'Puri': {'lat': 19.8135, 'lng': 85.8312},
            'Ganjam': {'lat': 19.3149, 'lng': 84.7941},
            'Sundargarh': {'lat': 22.1200, 'lng': 84.0372}
        }

        issues_to_add = []
        
        # Target 150 issues
        for i in range(150):
            # Pick a random district
            district = random.choice(list(ODISHA_DATA.keys()))
            if not ODISHA_DATA[district]: continue
            
            # Pick a random block
            block = random.choice(ODISHA_DATA[district])
            
            # Generate lat/lng around district center (or default if missing)
            center = DISTRICT_CENTERS.get(district, {'lat': 20.95, 'lng': 84.8})
            # Spread: +/- 0.15 degrees (~15km)
            lat = center['lat'] + random.uniform(-0.15, 0.15)
            lng = center['lng'] + random.uniform(-0.15, 0.15)

            # Randomize severity and time
            # Bias towards recent, unresolved issues for "Heatmap" effect
            days_ago = random.randint(0, 30)
            created_at = datetime.utcnow() - timedelta(days=days_ago)
            
            # Weighted severity: mostly medium/high
            severity_score = random.choices([30, 50, 70, 90], weights=[0.2, 0.4, 0.3, 0.1])[0]
            # Add some noise
            severity_score += random.uniform(-5, 5)

            issue = Issue(
                user_id=user.id,
                title=f"{random.choice(['Major', 'Minor', 'Severe', 'Reported'])} {random.choice(CATEGORIES)} in {block}",
                description=f"Automated seed data #{i}. Resident reports persistent issue.",
                category=random.choice(CATEGORIES),
                latitude=lat,
                longitude=lng,
                state="Odisha",
                district=district,
                block=block,
                status=random.choice(['Pending', 'In Progress', 'Resolved', 'Pending', 'Pending']), # Mostly pending
                severity_level="high" if severity_score > 70 else "medium",
                location_context=random.choice(CONTEXTS),
                created_at=created_at,
                severity_score=severity_score
            )
            issues_to_add.append(issue)

        db.session.bulk_save_objects(issues_to_add)
        db.session.commit()

        print(f"Success! Injected {len(issues_to_add)} issues across {len(ODISHA_DATA)} districts.")
        print("Heatmap should now look populated.")

if __name__ == "__main__":
    seed_demo_data()
