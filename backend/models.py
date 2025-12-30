from database import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) # Hashed password
    role = db.Column(db.String(20), default='citizen')
    trust_score = db.Column(db.Float, default=1.0)
    
    # Verification Fields
    is_verified = db.Column(db.Boolean, default=False)
    otp = db.Column(db.String(6))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_id(self):
        return str(self.id)

class Authority(UserMixin, db.Model):
    __tablename__ = 'authorities'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='authority')
    
    # Location Hierarchy
    state = db.Column(db.String(50))
    district = db.Column(db.String(50))
    block = db.Column(db.String(50))
    department = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_id(self):
        return str(self.id)

class Issue(db.Model):
    __tablename__ = 'issues'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    
    # Risk Context
    severity_level = db.Column(db.String(10), default='medium')
    location_context = db.Column(db.String(20), default='residential')
    
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    image_path = db.Column(db.String(255))
    status = db.Column(db.String(20), default='Pending')
    severity_score = db.Column(db.Float, default=0.0)
    
    # Location Data
    state = db.Column(db.String(50))
    district = db.Column(db.String(50))
    block = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    user = db.relationship('User', backref=db.backref('issues', lazy=True))