# Environment Variables Setup Guide

This guide explains how to properly configure environment variables for the FIXITY-CRI backend.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Never commit `.env` to git** (already in .gitignore)

---

## Required Environment Variables

### 1. SECRET_KEY (Required)

**Purpose:** Used for Flask session encryption and security features.

**How to generate:**
```bash
# Option 1: Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 2: Using OpenSSL
openssl rand -hex 32
```

**Example:**
```env
SECRET_KEY=a7f8d9e6c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7
```

⚠️ **Important:** 
- Generate a new, unique key for each environment
- Never share or commit your SECRET_KEY
- Use a different key for development and production

---

### 2. Email Configuration (Required for OTP Verification)

The application sends OTP verification emails during user registration. You need a Gmail account with an App Password.

#### Setting up Gmail App Password:

1. **Enable 2-Factor Authentication** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "FIXITY-CRI" or similar
   - Copy the 16-character password

3. **Add to `.env`:**
   ```env
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   ```

⚠️ **Security Notes:**
- Use an App Password, not your regular Gmail password
- App Passwords are safer and can be revoked without changing your main password
- Never share or commit your App Password
- If compromised, revoke it immediately from Google Account settings

---

### 3. Database Configuration (Optional)

**Default:** SQLite database (`fixity.db` in the backend directory)

**For production (PostgreSQL):**
```env
DATABASE_URL=postgresql://username:password@localhost/fixity_db
```

**For MySQL:**
```env
DATABASE_URL=mysql://username:password@localhost/fixity_db
```

---

## Complete .env Example

Here's a complete example with all variables:

```env
# Flask Configuration
SECRET_KEY=a7f8d9e6c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7

# Database (optional - defaults to SQLite)
DATABASE_URL=sqlite:///fixity.db

# Email/SMTP Configuration (required for OTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop

# Flask Environment (optional)
FLASK_ENV=development

# Upload Configuration (optional)
UPLOAD_FOLDER=./static/uploads
```

---

## Testing Your Configuration

### Test Email Configuration:

```bash
# Set environment variables (or use .env file)
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password

# Run the email test script
python debug_email.py
```

Expected output:
```
--- STARTING EMAIL TEST ---
Server: smtp.gmail.com:587
User: your-email@gmail.com
TLS Started.
Attempting Login...
Login Successful!
Mail SENT successfully!
--- TEST PASSED ---
```

### Test Flask Application:

```bash
# Make sure .env file exists with all required variables
python app.py
```

Expected startup (no errors about missing environment variables).

---

## Loading Environment Variables

### Option 1: Using python-dotenv (Recommended)

Install python-dotenv:
```bash
pip install python-dotenv
```

Add to your `app.py` (if not already present):
```python
from dotenv import load_dotenv
load_dotenv()  # Load .env file
```

### Option 2: Manual Export (for testing)

```bash
export SECRET_KEY=your-secret-key
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
python app.py
```

### Option 3: Using .env file with your IDE

Most IDEs (VS Code, PyCharm) can automatically load `.env` files when running Python scripts.

---

## Security Best Practices

### ✓ DO:
- Use `.env` files for local development
- Generate strong, random SECRET_KEY values
- Use Gmail App Passwords, not regular passwords
- Keep `.env` files private and never commit them
- Use different credentials for development and production
- Rotate credentials regularly
- Document required environment variables

### ✗ DON'T:
- Never commit `.env` files to git
- Never hardcode credentials in source code
- Never share your `.env` file
- Never use the same SECRET_KEY across environments
- Never use weak or default secret keys in production
- Never commit API keys, tokens, or passwords

---

## Troubleshooting

### "Email credentials not configured" warning:

**Cause:** MAIL_USERNAME or MAIL_PASSWORD not set

**Solution:**
1. Check that `.env` file exists in the backend directory
2. Verify MAIL_USERNAME and MAIL_PASSWORD are set in `.env`
3. Check that `python-dotenv` is installed: `pip install python-dotenv`
4. Ensure `load_dotenv()` is called in `app.py`

### "SMTPAuthenticationError: Username and Password not accepted":

**Cause:** Invalid email credentials or not using App Password

**Solution:**
1. Verify you're using a Gmail App Password, not regular password
2. Check that 2FA is enabled on your Google Account
3. Generate a new App Password
4. Update MAIL_PASSWORD in `.env`

### "SECRET_KEY environment variable must be set":

**Cause:** In production mode without SECRET_KEY

**Solution:**
1. Generate a secure SECRET_KEY (see instructions above)
2. Add it to your `.env` file or production environment
3. Restart the application

---

## Production Deployment

For production deployments:

1. **Never use `.env` files on production servers**
   - Use environment variables set by your hosting platform
   - Examples: Heroku Config Vars, AWS Systems Manager, Docker secrets

2. **Set environment variables in your hosting platform:**
   - Heroku: `heroku config:set SECRET_KEY=xxx`
   - AWS: Use AWS Systems Manager Parameter Store
   - Docker: Use docker-compose.yml or Kubernetes secrets

3. **Set FLASK_ENV to production:**
   ```env
   FLASK_ENV=production
   ```
   This enforces SECRET_KEY requirement and disables debug mode.

4. **Use strong credentials:**
   - Generate new SECRET_KEY for production
   - Use production email account
   - Use production database

---

## Additional Resources

- [Flask Configuration](https://flask.palletsprojects.com/en/latest/config/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [python-dotenv Documentation](https://github.com/theskumar/python-dotenv)
- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** December 30, 2025
