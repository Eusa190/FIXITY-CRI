import sqlite3
import os

# Based on find_by_name result: d:\PROJECT - CRI\backend\cri.db
DB_PATH = "fixity.db"

def migrate():
    print(f"Migrating {DB_PATH}...")
    try:
        if not os.path.exists(DB_PATH):
            print(f"Error: {DB_PATH} not found.")
            return

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
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
