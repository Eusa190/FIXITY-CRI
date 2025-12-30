import requests

BASE_URL = "http://localhost:8000"

def test_analytics():
    session = requests.Session()
    
    # 1. Login
    login_payload = {
        "email": "valid@gov.in",
        "password": "password123"
    }
    
    print(f"Logging in as {login_payload['email']}...")
    try:
        resp = session.post(f"{BASE_URL}/api/login", json=login_payload)
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code}")
            return

        print("Login successful.")
        
        # 2. Check Analytics
        print("Checking /api/analytics...")
        resp = session.get(f"{BASE_URL}/api/analytics")
        
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            # print(data) 
            
            # Validation
            required_keys = ['summary', 'pillars', 'trend', 'hotspots', 'distribution']
            missing = [k for k in required_keys if k not in data]
            
            if not missing:
                print("SUCCESS: JSON Structure is CORRECT.")
                print(f"CRI Score: {data['summary']['cri_score']}")
            else:
                print(f"FAILURE: Missing keys: {missing}")
                
        else:
            print(f"FAILURE: Status {resp.status_code}")

    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_analytics()
