import os
import sys

class Config:
    # SECRET_KEY configuration with security enforcement
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        # In development, provide a warning but use a development key
        # In production, this should fail
        if os.environ.get('FLASK_ENV') == 'production':
            raise ValueError(
                "SECRET_KEY environment variable must be set in production. "
                "Generate a secure random key and set it in your .env file."
            )
        else:
            print("\n" + "="*70, file=sys.stderr)
            print("WARNING: Using insecure development SECRET_KEY!", file=sys.stderr)
            print("Set SECRET_KEY environment variable for production use.", file=sys.stderr)
            print("="*70 + "\n", file=sys.stderr)
            SECRET_KEY = 'dev-insecure-key-change-in-production'
    
    # SQLite Database Configuration (easier for local development)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{os.path.join(BASE_DIR, "fixity.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload Configuration
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}

    # Session/Cookie Security (Explicit for robustness)
    SESSION_COOKIE_SECURE = False  # Allow over HTTP
    SESSION_COOKIE_HTTPONLY = True # Prevent JS access
    SESSION_COOKIE_SAMESITE = 'Lax' # Allow in same-site/localhost contexts
    PERMANENT_SESSION_LIFETIME = 86400 # 1 day

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
