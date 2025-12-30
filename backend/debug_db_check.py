from app import app, db, User, Authority

with app.app_context():
    print("\n--- CITIZENS ---")
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id} | Email: {u.email} | Verified: {u.is_verified}")

    print("\n--- AUTHORITIES ---")
    authorities = Authority.query.all()
    for a in authorities:
        print(f"ID: {a.id} | Email: {a.email} | District: {a.district} | Block: {a.block}")
