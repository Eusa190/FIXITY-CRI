
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
import os

# Load credentials from environment variables
SMTP_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('MAIL_PORT', 587))
USERNAME = os.environ.get('MAIL_USERNAME')
PASSWORD = os.environ.get('MAIL_PASSWORD')

def test_email():
    if not USERNAME or not PASSWORD:
        print("ERROR: Email credentials not configured!")
        print("Please set MAIL_USERNAME and MAIL_PASSWORD environment variables.")
        print("Example:")
        print("  export MAIL_USERNAME=your-email@gmail.com")
        print("  export MAIL_PASSWORD=your-app-password")
        sys.exit(1)
    
    print(f"--- STARTING EMAIL TEST ---")
    print(f"Server: {SMTP_SERVER}:{SMTP_PORT}")
    print(f"User: {USERNAME}")
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        print("TLS Started.")
        
        print("Attempting Login...")
        server.login(USERNAME, PASSWORD)
        print("Login Successful!")
        
        msg = MIMEMultipart()
        msg['From'] = USERNAME
        msg['To'] = USERNAME # Send to self
        msg['Subject'] = "Fixity SMTP Test"
        msg.attach(MIMEText("If you see this, email is working.", 'plain'))
        
        server.send_message(msg)
        print("Mail SENT successfully!")
        server.quit()
        print("--- TEST PASSED ---")
        
    except smtplib.SMTPAuthenticationError as e:
        print("\n!!! AUTHENTICATION ERROR !!!")
        print(f"Code: {e.smtp_code}")
        print(f"Message: {e.smtp_error}")
        print("Most likely: Invalid Password or App Password revoked.")
        
    except Exception as e:
        print(f"\n!!! GENERAL ERROR: { type(e).__name__ } !!!")
        print(str(e))

if __name__ == "__main__":
    test_email()
