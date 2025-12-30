import sqlite3

# Connect to the SQLite database
# The app defaults to 'instance/cri.db' or just 'cri.db' depending on config.
# Let's try standard locations.
DB_PATH = "instance/cri.db"

def migrate():
    print(f"Migrating {DB_PATH}...")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("PRAGMA table_info(issues)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'resolved_at' not in columns:
            print("Adding 'resolved_at' column...")
            cursor.execute("ALTER TABLE issues ADD COLUMN resolved_at DATETIME")
            conn.commit()
            print("Migration successful.")
        else:
            print("'resolved_at' column already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Migration failed (Main path): {e}")
        # Try root path fallback
        try:
            print("Trying fallback path 'cri.db'...")
            conn = sqlite3.connect("cri.db")
            cursor = conn.cursor()
            cursor.execute("ALTER TABLE issues ADD COLUMN resolved_at DATETIME")
            conn.commit()
            conn.close()
            print("Fallback migration successful.")
        except Exception as e2:
             print(f"Fallback failed: {e2}")

if __name__ == "__main__":
    migrate()
