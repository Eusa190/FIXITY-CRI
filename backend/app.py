import os
import random
import string
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_mail import Mail, Message
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from config import Config
from database import db
from models import User, Authority, Issue
import cri_engine
from flask import send_from_directory
import json

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("WARNING: python-dotenv not installed. Install with: pip install python-dotenv")
    print("Environment variables will need to be set manually.")

# Initialize App
app = Flask(__name__)
# Explicitly tell Flask where static files are if needed, but the route below handles uploads specifically.
app.config.from_object(Config)

# Load Odisha Data
ODISHA_DATA = {}
try:
    with open(os.path.join(app.root_path, 'data', 'odisha_data.json'), 'r') as f:
        ODISHA_DATA = json.load(f)
    print(f"Loaded {len(ODISHA_DATA)} districts from odisha_data.json")
except Exception as e:
    print(f"Error loading odisha_data.json: {e}")

# Enable CORS for React frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

# --- STATIC FILE SERVING FOR UPLOADS ---
@app.route('/api/static/uploads/<path:filename>')
def serve_uploads(filename):
    """Serve uploaded files to the frontend"""
    upload_folder = app.config.get('UPLOAD_FOLDER', 'static/uploads')
    return send_from_directory(os.path.join(app.root_path, upload_folder), filename)

# Mail Config - Load from environment variables
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# Validate required email configuration
if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
    print("WARNING: Email credentials not configured. Email functionality will not work.")
    print("Please set MAIL_USERNAME and MAIL_PASSWORD environment variables.")

db.init_app(app)
mail = Mail(app)

# Login Manager Setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login_page'

@login_manager.user_loader
def load_user(user_id):
    # Try finding in User table first, then Authority
    user = User.query.get(int(user_id))
    if user:
        return user
    return Authority.query.get(int(user_id))

# Ensure DB Tables Exist
with app.app_context():
    db.create_all()

# --- HELPER: OTP GENERATOR ---
def generate_otp():
    return ''.join(random.choices(string.digits, k=4))

# --- ROUTES ---

@app.route('/')
def home():
    return render_template('fixity.html')

# --- AUTHENTICATION ---

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # 1. Check Citizen Table
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            if not user.is_verified:
                flash('Please verify your email first.', 'warning')
                return render_template('login.html')
            login_user(user)
            return redirect(url_for('profile'))
            
        # 2. Check Authority Table
        auth_user = Authority.query.filter_by(email=email).first()
        if auth_user and check_password_hash(auth_user.password, password):
            login_user(auth_user)
            return redirect(url_for('authority_dashboard'))
            
        flash('Invalid Credentials', 'error')
        
    return render_template('login.html')

# --- API: LOGIN (JSON) ---
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # 1. Check Authority Table (PRIORITY: Gov IDs must not be shadowed by citizen accounts)
    auth_user = Authority.query.filter_by(email=email).first()
    if auth_user and check_password_hash(auth_user.password, password):
        login_user(auth_user)
        return jsonify({'success': True, 'redirect': '/authority/dashboard', 'role': 'authority'})

    # 2. Check Citizen Table
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        if not user.is_verified:
            return jsonify({'success': False, 'error': 'Please verify your email first'}), 400
        login_user(user)
        return jsonify({'success': True, 'redirect': '/profile', 'role': 'citizen'})
        
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

# --- API: LOGOUT (JSON) ---
@app.route('/api/logout', methods=['POST'])
def api_logout():
    logout_user()
    return jsonify({'success': True})

# --- API: REGISTER AUTHORITY (JSON) ---
@app.route('/api/register/authority', methods=['POST'])
def api_register_authority():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    state = data.get('state')
    district = data.get('district')
    block = data.get('block')
    
    if Authority.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Email already registered'}), 400
        
    hashed_pw = generate_password_hash(password)
    new_auth = Authority(
        username=username,
        email=email,
        password=hashed_pw,
        state=state,
        district=district,
        block=block,
        role='authority'
    )
    db.session.add(new_auth)
    db.session.commit()
    
    return jsonify({'success': True, 'redirect': '/login'})

@app.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

# --- API: SEND OTP (CITIZEN) ---
@app.route('/api/send_otp', methods=['POST'])
def send_otp_api():
    data = request.json
    email = data.get('email')
    
    # Check if email exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    otp = generate_otp()
    
    # --- SEND EMAIL LOGIC STARTS HERE ---
    try:
        msg = Message('Your Fixity OTP', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Your verification code is: {otp}'
        mail.send(msg)
        print(f"Email sent to {email}")
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500
    # ------------------------------------

    # Store OTP in session temporarily
    session['temp_otp'] = otp
    session['temp_email'] = email
    
    return jsonify({'message': 'OTP Sent Successfully'})
# --- API: VERIFY OTP & REGISTER CITIZEN ---
@app.route('/api/register_citizen', methods=['POST'])
def register_citizen():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user_otp = data.get('otp')
    
    # Debug Session
    print(f"DEBUG REGISTER: Session keys: {list(session.keys())}")
    print(f"DEBUG REGISTER: Input OTP: {user_otp}, Session OTP: {session.get('temp_otp')}")
    
    # Verify OTP
    if 'temp_otp' not in session or session['temp_otp'] != user_otp:
        return jsonify({'error': 'Invalid OTP'}), 400
        
    hashed_pw = generate_password_hash(password)
    new_user = User(
        username=username,
        email=session['temp_email'],
        password=hashed_pw,
        is_verified=True,
        role='citizen'
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Clear session temp data
    session.pop('temp_otp', None)
    session.pop('temp_email', None)
    
    return jsonify({'redirect': url_for('login_page')})

# --- AUTHORITY REGISTRATION (NO OTP) ---
@app.route('/register/authority', methods=['POST'])
def register_authority():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    state = request.form.get('state')
    district = request.form.get('district')
    block = request.form.get('block')
    
    if Authority.query.filter_by(email=email).first():
        flash('Email already registered', 'error')
        return redirect(url_for('register_page'))
        
    hashed_pw = generate_password_hash(password)
    new_auth = Authority(
        username=username,
        email=email,
        password=hashed_pw,
        state=state,
        district=district,
        block=block,
        role='authority'
    )
    db.session.add(new_auth)
    db.session.commit()
    
    flash('Authority Account Created. Please Login.', 'success')
    return redirect(url_for('login_page'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_page'))

# --- CORE FEATURES ---

@app.route('/profile')
@login_required
def profile():
    if current_user.role != 'citizen':
        return redirect(url_for('authority_dashboard'))
    my_issues = Issue.query.filter_by(user_id=current_user.id).order_by(Issue.created_at.desc()).all()
    return render_template('profile.html', user=current_user, issues=my_issues)

@app.route('/authority/dashboard')
@login_required
def authority_dashboard():
    if current_user.role != 'authority':
        return redirect(url_for('profile'))
    
    # Show issues relevant to authority's block - RISK FIRST
    issues = Issue.query.filter(
        Issue.block == current_user.block,
        Issue.status != 'Resolved'
    ).order_by(Issue.severity_score.desc()).all()
    return render_template('authority_dashboard.html', authority=current_user, issues=issues)

@app.route('/report', methods=['GET'])
@login_required
def report():
    return render_template('report.html')

@app.route('/community')
def community_feed():
    # Public feed
    issues = Issue.query.order_by(Issue.created_at.desc()).limit(50).all()
    return render_template('all_reported.html', issues=issues)

# --- MAP VISUALIZATION API ---

@app.route('/map')
def map_page():
    return render_template('cri_map.html')

@app.route('/api/get_cri_data/<district>')
def get_cri_data(district):
    # REAL CRI ENGINE AGGREGATION
    data = cri_engine.get_aggregated_cri_data(district)
    
    # If no data found (empty DB), we want to return the REAL BLOCKS with 0 risk (Green)
    # instead of fake random data, if the district exists in our real dataset.
    if not data:
        if district in ODISHA_DATA:
            block_list = ODISHA_DATA[district]
            # Generate "Safe" default state for real blocks
            # We need approximate lat/lng for these blocks for the map to work nicely.
            # IN A REAL APP: We would have a database of lat/lng for every block.
            # HERE: We will generate them deterministically around a district center.

            # Geocoding centers for major districts (approximate) - Expand as needed
            district_centers = {
                'Khordha': {'lat': 20.1, 'lng': 85.6},
                'Cuttack': {'lat': 20.5, 'lng': 85.8},
                'Puri': {'lat': 19.8, 'lng': 85.8},
                'Ganjam': {'lat': 19.3, 'lng': 84.9},
                'Sundargarh': {'lat': 22.1, 'lng': 84.0},
                'Sambalpur': {'lat': 21.4, 'lng': 83.9},
                # Default for others (center of Odisha)
                'Default': {'lat': 20.95, 'lng': 84.8}
            }

            center = district_centers.get(district, district_centers['Default'])
            import random

            # Deterministic seed based on district name to keep map stable
            import hashlib
            seed = int(hashlib.md5(district.encode()).hexdigest()[:8], 16)
            random.seed(seed)

            real_data_result = []
            for block in block_list:
                # Scatter blocks around the district center
                lat_offset = random.uniform(-0.3, 0.3)
                lng_offset = random.uniform(-0.3, 0.3)

                real_data_result.append({
                    'block': block,
                    'cri': 0, # Default safe
                    'color': 'green',
                    'lat': center['lat'] + lat_offset,
                    'lng': center['lng'] + lng_offset,
                    'issue_count': 0  # No issues for safe blocks
                })
            return jsonify(real_data_result)

        # Fallback to demo data for non-Odisha locations (e.g. Pune/Delhi demos)
        # DEMO DATA INJECTOR (Requested by User)
        if district == 'Pune': # Example for specific demo flow
             data.append({
                'block': 'Demo Block (Wakad)',
                'cri': 75.5,
                'color': 'orange',
                'lat': 18.5983,
                'lng': 73.7759
            })
        
        # If still empty (other districts), use the larger fake generator
        if not data:
             return get_cri_data_fake(district)
        
    return jsonify(data)

def get_cri_data_fake(district):
    import random
    
    # Comprehensive CRI Data for major districts
    fake_data = {
        'Pune': [
            {'block': 'Hinjewadi', 'cri': 85, 'color': 'red', 'lat': 18.5913, 'lng': 73.7389},
            {'block': 'Wakad', 'cri': 45, 'color': 'green', 'lat': 18.5983, 'lng': 73.7759},
            {'block': 'Baner', 'cri': 72, 'color': 'orange', 'lat': 18.5590, 'lng': 73.7868},
            {'block': 'Shivajinagar', 'cri': 60, 'color': 'orange', 'lat': 18.5314, 'lng': 73.8446},
            {'block': 'Kothrud', 'cri': 35, 'color': 'green', 'lat': 18.5074, 'lng': 73.8077},
            {'block': 'Hadapsar', 'cri': 78, 'color': 'orange', 'lat': 18.5089, 'lng': 73.9260}
        ],
        'Central Delhi': [
            {'block': 'Connaught Place', 'cri': 55, 'color': 'orange', 'lat': 28.6315, 'lng': 77.2167},
            {'block': 'Karol Bagh', 'cri': 82, 'color': 'red', 'lat': 28.6529, 'lng': 77.1905},
            {'block': 'Paharganj', 'cri': 68, 'color': 'orange', 'lat': 28.6448, 'lng': 77.2107}
        ],
        'South Delhi': [
            {'block': 'Saket', 'cri': 42, 'color': 'green', 'lat': 28.5245, 'lng': 77.2066},
            {'block': 'Greater Kailash', 'cri': 38, 'color': 'green', 'lat': 28.5485, 'lng': 77.2436},
            {'block': 'Hauz Khas', 'cri': 65, 'color': 'orange', 'lat': 28.5494, 'lng': 77.2001}
        ],
        'Mumbai City': [
            {'block': 'Colaba', 'cri': 48, 'color': 'green', 'lat': 18.9067, 'lng': 72.8147},
            {'block': 'Fort', 'cri': 55, 'color': 'orange', 'lat': 18.9322, 'lng': 72.8347},
            {'block': 'Marine Lines', 'cri': 62, 'color': 'orange', 'lat': 18.9432, 'lng': 72.8235}
        ],
        'Mumbai Suburban': [
            {'block': 'Andheri', 'cri': 88, 'color': 'red', 'lat': 19.1136, 'lng': 72.8697},
            {'block': 'Bandra', 'cri': 72, 'color': 'orange', 'lat': 19.0596, 'lng': 72.8295},
            {'block': 'Borivali', 'cri': 45, 'color': 'green', 'lat': 19.2307, 'lng': 72.8567},
            {'block': 'Goregaon', 'cri': 78, 'color': 'orange', 'lat': 19.1663, 'lng': 72.8526}
        ],
        'Bengaluru Urban': [
            {'block': 'Whitefield', 'cri': 82, 'color': 'red', 'lat': 12.9698, 'lng': 77.7500},
            {'block': 'Koramangala', 'cri': 55, 'color': 'orange', 'lat': 12.9352, 'lng': 77.6245},
            {'block': 'Electronic City', 'cri': 68, 'color': 'orange', 'lat': 12.8399, 'lng': 77.6770},
            {'block': 'Indiranagar', 'cri': 42, 'color': 'green', 'lat': 12.9784, 'lng': 77.6408},
            {'block': 'HSR Layout', 'cri': 75, 'color': 'orange', 'lat': 12.9116, 'lng': 77.6389}
        ],
        'Hyderabad': [
            {'block': 'Gachibowli', 'cri': 78, 'color': 'orange', 'lat': 17.4401, 'lng': 78.3489},
            {'block': 'HITEC City', 'cri': 85, 'color': 'red', 'lat': 17.4435, 'lng': 78.3772},
            {'block': 'Banjara Hills', 'cri': 38, 'color': 'green', 'lat': 17.4156, 'lng': 78.4347},
            {'block': 'Secunderabad', 'cri': 62, 'color': 'orange', 'lat': 17.4399, 'lng': 78.4983}
        ],
        'Chennai': [
            {'block': 'T. Nagar', 'cri': 65, 'color': 'orange', 'lat': 13.0418, 'lng': 80.2341},
            {'block': 'Anna Nagar', 'cri': 52, 'color': 'orange', 'lat': 13.0850, 'lng': 80.2101},
            {'block': 'Velachery', 'cri': 78, 'color': 'orange', 'lat': 12.9815, 'lng': 80.2180},
            {'block': 'OMR', 'cri': 88, 'color': 'red', 'lat': 12.9089, 'lng': 80.2271}
        ],
        'Ahmedabad': [
            {'block': 'SG Highway', 'cri': 72, 'color': 'orange', 'lat': 23.0469, 'lng': 72.5178},
            {'block': 'Satellite', 'cri': 45, 'color': 'green', 'lat': 23.0225, 'lng': 72.5270},
            {'block': 'Navrangpura', 'cri': 58, 'color': 'orange', 'lat': 23.0369, 'lng': 72.5594},
            {'block': 'Maninagar', 'cri': 82, 'color': 'red', 'lat': 22.9938, 'lng': 72.6097}
        ],
        'Kolkata': [
            {'block': 'Salt Lake', 'cri': 48, 'color': 'green', 'lat': 22.5800, 'lng': 88.4179},
            {'block': 'New Town', 'cri': 38, 'color': 'green', 'lat': 22.5958, 'lng': 88.4795},
            {'block': 'Park Street', 'cri': 65, 'color': 'orange', 'lat': 22.5551, 'lng': 88.3525},
            {'block': 'Howrah', 'cri': 85, 'color': 'red', 'lat': 22.5958, 'lng': 88.2636}
        ],
        'Jaipur': [
            {'block': 'Malviya Nagar', 'cri': 55, 'color': 'orange', 'lat': 26.8505, 'lng': 75.8019},
            {'block': 'Vaishali Nagar', 'cri': 42, 'color': 'green', 'lat': 26.9124, 'lng': 75.7390},
            {'block': 'Mansarovar', 'cri': 68, 'color': 'orange', 'lat': 26.8684, 'lng': 75.7542},
            {'block': 'MI Road', 'cri': 78, 'color': 'orange', 'lat': 26.9124, 'lng': 75.7873}
        ],
        'Lucknow': [
            {'block': 'Gomti Nagar', 'cri': 52, 'color': 'orange', 'lat': 26.8565, 'lng': 81.0167},
            {'block': 'Hazratganj', 'cri': 65, 'color': 'orange', 'lat': 26.8497, 'lng': 80.9470},
            {'block': 'Aliganj', 'cri': 75, 'color': 'orange', 'lat': 26.8989, 'lng': 80.9372},
            {'block': 'Indira Nagar', 'cri': 48, 'color': 'green', 'lat': 26.8742, 'lng': 81.0017}
        ],
        # Explicit empty lists for Real-Time districts to prevent "Block A" generation
        'Khordha': [], 
        'Bhubaneswar': [],
        
        'Cuttack': [
            {'block': 'Cuttack Ward 1', 'cri': 55, 'color': 'orange', 'lat': 20.4625, 'lng': 85.8828},
            {'block': 'CDA Sector 6', 'cri': 40, 'color': 'green', 'lat': 20.4800, 'lng': 85.8500},
            {'block': 'Chauliaganj', 'cri': 85, 'color': 'red', 'lat': 20.4500, 'lng': 85.9000},
            {'block': 'Badambadi', 'cri': 72, 'color': 'orange', 'lat': 20.4600, 'lng': 85.8700}
        ],
        'Puri': [
            {'block': 'Grand Road', 'cri': 65, 'color': 'orange', 'lat': 19.8135, 'lng': 85.8312},
            {'block': 'Sea Beach', 'cri': 45, 'color': 'green', 'lat': 19.7980, 'lng': 85.8240},
            {'block': 'Talabania', 'cri': 78, 'color': 'orange', 'lat': 19.8200, 'lng': 85.8400}
        ],
        'Rourkela': [
            {'block': 'Civil Township', 'cri': 42, 'color': 'green', 'lat': 22.2604, 'lng': 84.8536},
            {'block': 'Sector 19', 'cri': 88, 'color': 'red', 'lat': 22.2500, 'lng': 84.8700},
            {'block': 'Chhend', 'cri': 60, 'color': 'orange', 'lat': 22.2700, 'lng': 84.8300}
        ],
        'Darjeeling': [
            {'block': 'Mall Road', 'cri': 35, 'color': 'green', 'lat': 27.0410, 'lng': 88.2663},
            {'block': 'Ghoom', 'cri': 55, 'color': 'orange', 'lat': 27.0100, 'lng': 88.2500}
        ],
        'Siliguri': [
            {'block': 'Hill Cart Road', 'cri': 75, 'color': 'orange', 'lat': 26.7271, 'lng': 88.3953},
            {'block': 'Sevoke Road', 'cri': 82, 'color': 'red', 'lat': 26.7400, 'lng': 88.4100},
            {'block': 'Pradhan Nagar', 'cri': 50, 'color': 'orange', 'lat': 26.7100, 'lng': 88.3800}
        ]
    }
    
    result = fake_data.get(district, [])

    # If district not found, generate random data based on district name
    if not result:
        # Generate mock data for unknown districts
        import hashlib
        seed = int(hashlib.md5(district.encode()).hexdigest()[:8], 16)
        random.seed(seed)
        
        base_lat = 20.0 + random.uniform(-8, 10)
        base_lng = 77.0 + random.uniform(-5, 8)
    
        blocks = ['Block A', 'Block B', 'Block C', 'Block D']
        result = []
        for i, block in enumerate(blocks):
            cri = random.randint(25, 95)
            color = 'red' if cri >= 80 else 'orange' if cri >= 50 else 'green'
            result.append({
                'block': f'{district} {block}',
                'cri': cri,
                'color': color,
                'issue_count': random.randint(1, 15), # Fake count
                'lat': base_lat + random.uniform(-0.1, 0.1),
                'lng': base_lng + random.uniform(-0.1, 0.1)
            })
    
    return jsonify(result)

# --- NEW API ENDPOINTS FOR REACT FRONTEND ---
# --- API: LOCATIONS (HIERARCHY) ---
@app.route('/api/locations')
def get_locations():
    """Return the hierarchy of States -> Districts -> Blocks"""
    # Currently focused on Odisha as the primary supported state
    return jsonify({
        'Odisha': ODISHA_DATA,
        # Keep legacy demo states if needed, or just partial lists
        'Maharashtra': { 'Pune': [], 'Mumbai': [] },
        'Delhi': {'Central Delhi': [], 'South Delhi': []}
    })
@app.route('/api/me')
def get_current_user():
    """Get current logged in user info"""
    if current_user.is_authenticated:
        user_data = {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'role': current_user.role,
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None
        }
        if current_user.role == 'authority':
            user_data['state'] = current_user.state
            user_data['district'] = current_user.district
            user_data['block'] = current_user.block
        return jsonify(user_data)
    return jsonify(None)

@app.route('/api/mobile/report', methods=['POST'])
def mobile_submit_report():
    """
    Open endpoint for Mobile App (No Auth).
    Uses a default 'Mobile User' to satisfy DB constraints.
    """
    # 1. Get or Create Mobile User
    mobile_user = User.query.filter_by(email='mobile@fixity.com').first()
    if not mobile_user:
        hashed_pw = generate_password_hash('mobile123')
        mobile_user = User(
            username='Mobile Citizen',
            email='mobile@fixity.com',
            password=hashed_pw,
            is_verified=True,
            role='citizen'
        )
        db.session.add(mobile_user)
        db.session.commit()

    # 2. Parse Request
    # Mobile sends: category, latitude, longitude, description, image
    category = request.form.get('category')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    description = request.form.get('description') or "Reported via Mobile App"
    
    # Auto-generate Title
    title = f"Mobile Report: {category}"

    # Get Location Hierarchy from request (sent by updated mobile app)
    # Default to 'Maharashtra' / 'Pune' / 'Wakad' only if missing
    state = request.form.get('state') or "Maharashtra"
    district = request.form.get('district') or "Pune" 
    block = request.form.get('block') or "Wakad"
    location_context = request.form.get('location_context') or "residential"

    # Handle Image
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            filename = secure_filename(file.filename)
            upload_folder = app.config.get('UPLOAD_FOLDER', 'static/uploads')
            os.makedirs(upload_folder, exist_ok=True)
            file.save(os.path.join(upload_folder, filename))
            image_path = filename

    # 3. Create Issue
    new_issue = Issue(
        user_id=mobile_user.id,
        title=title,
        description=description,
        category=category,
        latitude=float(latitude) if latitude else 0.0,
        longitude=float(longitude) if longitude else 0.0,
        state=state,
        district=district,
        block=block,
        image_path=image_path,
        status='Pending',
        severity_level='medium',
        location_context=location_context
    )

    # 4. Calculate Risk Score
    # Using default trust score 1.0 since mobile user is generic
    risk_score = cri_engine.calculate_issue_risk(new_issue, user_trust_score=1.0)
    new_issue.severity_score = risk_score
    
    db.session.add(new_issue)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Mobile report submitted'})


@app.route('/api/submit_report', methods=['POST'])
@login_required
def submit_report():
    """Submit a new issue report"""
    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    state = request.form.get('state')
    district = request.form.get('district')
    block = request.form.get('block')
    
    # New Risk Context Fields
    severity_level = request.form.get('severity_level', 'medium')
    location_context = request.form.get('location_context', 'residential')
    
    # Handle image upload
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            filename = secure_filename(file.filename)
            upload_folder = app.config.get('UPLOAD_FOLDER', 'static/uploads')
            os.makedirs(upload_folder, exist_ok=True)
            file.save(os.path.join(upload_folder, filename))
            image_path = filename
    
    # Create Issue Instance
    new_issue = Issue(
        user_id=current_user.id,
        title=title,
        description=description,
        category=category,
        latitude=float(latitude) if latitude else None,
        longitude=float(longitude) if longitude else None,
        state=state,
        district=district,
        block=block,
        image_path=image_path,
        status='Pending',
        # Store context
        severity_level=severity_level,
        location_context=location_context
    )
    
    # CALCULATE RISK SCORE
    trust_score = getattr(current_user, 'trust_score', 1.0)
    # Ensure creation time is set for calculation if needed, though DB usually sets on commit.
    # cri_engine handles None/empty created_at by assuming 0 days.
    risk_score = cri_engine.calculate_issue_risk(new_issue, user_trust_score=trust_score)
    new_issue.severity_score = risk_score
    
    db.session.add(new_issue)
    db.session.commit()
    
    return jsonify({'success': True, 'redirect': '/profile'})

@app.route('/api/update_status', methods=['POST'])
@login_required
def update_status():
    """Update issue status (for authorities)"""
    if current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    issue_id = data.get('issue_id')
    status = data.get('status')
    
    issue = Issue.query.get(issue_id)
    if issue:
        issue.status = status
        
        # RISK LOGIC: RESOLVED ISSUES DROP TO 0
        if status == 'Resolved':
            issue.severity_score = 0.0
            # Set resolution timestamp if not already set
            if not issue.resolved_at:
                issue.resolved_at = datetime.utcnow()
            
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Issue not found'}), 404

@app.route('/api/my_issues')
@login_required
def get_my_issues():
    """Get issues reported by current user"""
    issues = Issue.query.filter_by(user_id=current_user.id).order_by(Issue.created_at.desc()).all()
    return jsonify([{
        'id': i.id,
        'title': i.title,
        'description': i.description,
        'category': i.category,
        'status': i.status,
        'severity_score': i.severity_score,
        'block': i.block,
        'district': i.district,
        'image_path': i.image_path,
        'created_at': i.created_at.isoformat() if i.created_at else None
    } for i in issues])

@app.route('/api/community_feed')
def get_community_feed():
    """Get all issues for community feed"""
    issues = Issue.query.order_by(Issue.created_at.desc()).limit(50).all()
    return jsonify([{
        'id': i.id,
        'title': i.title,
        'description': i.description,
        'category': i.category,
        'status': i.status,
        'block': i.block,
        'district': i.district,
        'image_path': i.image_path,
        'created_at': i.created_at.isoformat() if i.created_at else None
    } for i in issues])

@app.route('/api/authority_issues')
@login_required
def get_authority_issues():
    """Get issues for authority's block"""
    if current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # RISK FIRST: Unresolved only, sorted by severity
    issues = Issue.query.filter(
        Issue.block == current_user.block,
        Issue.status != 'Resolved'
    ).order_by(Issue.severity_score.desc()).all()
    
    # --- TIME-BASED ESCALATION ON READ ---
    # We recalculate the risk score here to ensure "days_unresolved" is accurate to the minute.
    # This avoids needing a background cron job.
    issues_changed = False
    for issue in issues:
        # Calculate new risk
        # Note: We pass 1.0 as trust score default or fetch from user if needed, 
        # but for authority view, raw risk is more important. 
        # Let's check if we can get the original reporter's trust score easily.
        # For speed, we'll assume standard trust (1.0) or keep previous logic if complex.
        # Actually, `cri_engine` needs the issue object.
        
        old_score = issue.severity_score
        new_score = cri_engine.calculate_issue_risk(issue, user_trust_score=1.0) # Using base trust for escalation check
        
        if abs(new_score - old_score) > 0.1: # simple float comparison
            issue.severity_score = new_score
            issues_changed = True
            
    if issues_changed:
        db.session.commit()
        # Re-sort if scores changed significantly? 
        # Ideally yes, but for now let's just return the updated list (client might sort).
        issues.sort(key=lambda x: x.severity_score, reverse=True)
    
    return jsonify([{
        'id': i.id,
        'title': i.title,
        'description': i.description,
        'category': i.category,
        'status': i.status,
        'severity_score': i.severity_score,
        'block': i.block,
        'district': i.district,
        'image_path': i.image_path,
        'created_at': i.created_at.isoformat() if i.created_at else None
    } for i in issues])

@app.route('/api/analytics')
@login_required
def get_analytics():
    """
    Analytics dashboard endpoint.
    For authorities: Shows analytics for their assigned block only.
    For others: Shows system-wide analytics.
    """
    # --- 1. Top Summary (The "oh no" row) ---
    
    # Filter by block if user is an authority
    query = Issue.query.filter(Issue.status != 'Resolved')
    if current_user.role == 'authority':
        query = query.filter(Issue.block == current_user.block)
    
    active_issues = query.all()
    
    # CRI Calculation: Simple Sum (matching Authority Dashboard)
    # Sum of all active issue severity scores, capped at 100
    if active_issues:
        total_raw_risk = sum(i.severity_score for i in active_issues)
        current_cri = min(100, int(total_raw_risk))
    else:
        current_cri = 0
    
    # High Risk Issues (Real)
    high_risk_count = Issue.query.filter(
        Issue.status != 'Resolved', 
        Issue.severity_score > 70
    ).count()
    
    # Avg Resolution Time (Real)
    # Fetch resolved issues with timestamps
    resolved_issues = Issue.query.filter(Issue.status == 'Resolved', Issue.resolved_at != None).all()
    if resolved_issues:
        total_seconds = sum((i.resolved_at - i.created_at).total_seconds() for i in resolved_issues)
        avg_seconds = total_seconds / len(resolved_issues)
        
        if avg_seconds < 3600:
            avg_res_time = f"{int(avg_seconds / 60)} mins"
        elif avg_seconds < 86400:
            avg_res_time = f"{round(avg_seconds / 3600, 1)} hours"
        else:
            avg_res_time = f"{round(avg_seconds / 86400, 1)} days"
    else:
        avg_res_time = "N/A" # Default before data
    
    # Repeat Complaint Rate (Real)
    # Logic: Count issues with same (category, block) / Total Issues
    all_issues_count = Issue.query.count()
    if all_issues_count > 0:
        unique_combinations = db.session.query(
            Issue.block, Issue.category
        ).group_by(Issue.block, Issue.category).count()
        
        # Simple heuristic: (1 - unique/total) * 100
        repeat_rate_val = (1 - (unique_combinations / all_issues_count)) * 100
        repeat_rate_val = max(0, repeat_rate_val) # Safety
        repeat_rate = f"{int(repeat_rate_val)}%"
    else:
        repeat_rate = "0%"
    
    # --- 2. CRI Risk Breakdown (Pillars) ---
    PILLAR_MAP = {
        'Pothole': 'Infrastructure', 
        'Water Leakage': 'Public Health', 
        'Garbage': 'Public Health', 
        'Traffic Violation': 'Public Safety',
        'Stray Animals': 'Public Safety',
        'Electricity': 'Infrastructure'
    }
    
    pillar_counts = {'Public Safety': 0, 'Public Health': 0, 'Infrastructure': 0, 'Governance': 0}
    
    for issue in active_issues:
        pillar = PILLAR_MAP.get(issue.category, 'Governance')
        pillar_counts[pillar] += issue.severity_score
        
    total_pillar_risk = sum(pillar_counts.values()) or 1
    pillar_data = [
        {'name': p, 'risk': round(s, 1), 'percent': round((s/total_pillar_risk)*100)} 
        for p, s in pillar_counts.items()
    ]
    
    # --- 3. Risk Over Time (Trend) - REAL ---
    # Calculate daily total risk for last 7 days
    from datetime import timedelta
    trend_labels = []
    trend_vals = []
    
    today = datetime.utcnow().date()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        trend_labels.append(day.strftime('%a')) # Mon, Tue...
        
        end_of_day = datetime(day.year, day.month, day.day, 23, 59, 59)
        
        # Get issues active at end of that day
        daily_query = Issue.query.filter(
            Issue.created_at <= end_of_day,
            (Issue.status != 'Resolved') | (Issue.resolved_at > end_of_day)
        )
        # Apply block filter for authorities
        if current_user.role == 'authority':
            daily_query = daily_query.filter(Issue.block == current_user.block)
        
        daily_issues = daily_query.all()
        
        if daily_issues:
            d_cri = min(100, int(sum(i.severity_score for i in daily_issues)))
        else:
            d_cri = 0
        
        trend_vals.append(d_cri)

    trend_data = {
        'labels': trend_labels,
        'values': trend_vals
    }
    
    # --- 4. Hotspot Table (Real) ---
    hotspots = db.session.query(
        Issue.block, 
        func.sum(Issue.severity_score).label('total_risk'),
        func.count(Issue.id).label('issue_count')
    ).filter(Issue.status != 'Resolved').group_by(Issue.block).order_by(func.sum(Issue.severity_score).desc()).limit(5).all()
    
    hotspot_data = []
    for block, risk, count in hotspots:
        dom_cat = db.session.query(Issue.category, func.count(Issue.id)).filter(
            Issue.block == block, Issue.status != 'Resolved'
        ).group_by(Issue.category).order_by(func.count(Issue.id).desc()).first()
        dominant = dom_cat[0] if dom_cat else 'General'
        
        # Calculate "Unresolved Time" for the oldest issue in this block
        oldest = Issue.query.filter(Issue.block == block, Issue.status != 'Resolved').order_by(Issue.created_at.asc()).first()
        if oldest:
            delta = datetime.utcnow() - oldest.created_at
            if delta.days > 0:
               duration_str = f"{delta.days}d"
            else:
               duration_str = f"{int(delta.seconds / 3600)}h"
        else:
            duration_str = "0h"
        
        hotspot_data.append({
            'area': block,
            'cri': round(risk, 1),
            'dominant_risk': dominant,
            'duration': duration_str # "6d" or "4h"
        })
        
    # --- 5. Issue Load Distribution (Real) ---
    cat_distribution = db.session.query(
        Issue.category, func.count(Issue.id)
    ).group_by(Issue.category).all()
    
    dist_data = {cat: count for cat, count in cat_distribution}

    
    analytics_package = {
        'summary': {
            'cri_score': current_cri,
            'high_risk_count': high_risk_count,
            'avg_res_time': avg_res_time,
            'repeat_rate': repeat_rate
        },
        'pillars': pillar_data,
        'trend': trend_data,
        'hotspots': hotspot_data,
        'distribution': dist_data
    }
    
    return jsonify(analytics_package)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)
