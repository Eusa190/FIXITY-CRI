# FIXITY - Civic Risk Index (CRI) System

## Project Overview

**FIXITY** is a comprehensive civic issue management and risk assessment platform that enables citizens to report infrastructure problems and helps authorities monitor and respond to civic risks in real-time. The system uses a proprietary **Civic Risk Index (CRI)** algorithm to quantify and prioritize civic issues based on severity, location, time escalation, and reporter credibility.

## System Architecture

```
PROJECT - CRI/
├── backend/          # Flask API Server
├── frontend/         # React Web Application  
└── fixity_mobile/    # Flutter Mobile App
```

### Components

**1. Backend (Flask + SQLAlchemy)**
- RESTful API server
- CRI calculation engine
- Real-time data aggregation
- Authentication & authorization
- Database management

**2. Frontend (React + TypeScript + Vite)**
- Authority Dashboard (real-time monitoring)
- Analytics Dashboard (data visualization)
- Community Feed
- Issue reporting interface
- Interactive map visualization

**3. Mobile App (Flutter)**
- Citizen issue reporting
- CRI snapshot viewer
- Community feed
- Cross-platform (Android/iOS)

## Core Features

### 1. Civic Risk Index (CRI) Calculation

**Formula:**
```
CRI = (Base Risk × Severity × Location) + Time Escalation × User Trust
```

**Components:**
- **Base Risk**: Category-specific baseline (1-10)
  - Public Safety: 9
  - Public Health: 8
  - Infrastructure: 6
  - Governance: 4

- **Severity Multiplier**: Issue severity (1.0-2.5)
  - Critical: 2.5
  - High: 2.0
  - Medium: 1.5
  - Low: 1.0

- **Location Multiplier**: Context sensitivity (1.0-2.0)
  - School Zone: 2.0
  - Hospital Zone: 1.8
  - Market Area: 1.5
  - Residential: 1.2
  - Rural: 1.0

- **Time Escalation**: Logarithmic growth
  ```
  Escalation = log(hours_unresolved + 1) × 2
  ```
  - 6 hours: +1.95 points
  - 24 hours: +3.22 points
  - 72 hours: +4.29 points

- **User Trust Score**: Reporter credibility (0.5-1.5)

### 2. Auto-Escalation System

Issues automatically gain risk points over time:
- **Hour-based**: Optimized for demo visibility
- **Logarithmic**: Quick initial growth, then levels off
- **Real-time**: Recalculated on every API call
- **Visible countdown**: Shows next escalation timer

### 3. Authority Dashboard

**Real-Time Monitoring:**
- Live CRI score (auto-refresh every 5 seconds)
- Issue queue with priority sorting
- Time escalation indicators
- Escalation countdown timers
- Color-coded urgency levels

**Visual Features:**
- 🟢 Green: < 1 hour (fresh)
- 🟠 Orange: 1-24 hours (aging)
- 🔴 Red: 1+ days (critical)
- ⏰ Clock icon: Urgent issues (6+ hours)

**Escalation Summary:**
- Shows count of escalating issues
- Displays soonest next escalation
- Example: "🕐 3 escalating +0.4pts in 23m"

### 4. Analytics Dashboard

**Data Visualization:**
- Real-time CRI tracking
- 7-day risk trend graph
- Risk composition pie chart
- Top risk locations
- Issue distribution by category
- Performance metrics

**Jurisdiction Filtering:**
- Authorities see only their assigned block
- Real-time auto-refresh (5 seconds)
- Synchronized with Dashboard CRI

### 5. Mobile Application

**Citizen Features:**
- Report issues with photos
- Add location (GPS or manual)
- Real-time CRI snapshot
- Community feed
- Issue tracking

**Real-Time Data:**
- Live issue counts
- CRI score for selected area
- Location-based filtering

## Technology Stack

### Backend
- **Framework**: Flask 2.x
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: Flask-Login
- **Password Hashing**: Werkzeug
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

### Mobile
- **Framework**: Flutter 3.x
- **Language**: Dart
- **HTTP**: http package
- **State Management**: StatefulWidget

## Database Schema

### Users Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20),          -- 'authority', 'citizen', 'admin'
    block VARCHAR(100),         -- For authorities
    district VARCHAR(100),
    trust_score FLOAT DEFAULT 1.0,
    created_at DATETIME
);
```

### Issues Table
```sql
CREATE TABLE issue (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),       -- 'Public Safety', 'Public Health', etc.
    severity_level VARCHAR(20), -- 'Critical', 'High', 'Medium', 'Low'
    severity_score FLOAT,       -- Calculated CRI score
    latitude FLOAT,
    longitude FLOAT,
    block VARCHAR(100),
    district VARCHAR(100),
    location_context VARCHAR(50), -- 'School Zone', 'Hospital Zone', etc.
    status VARCHAR(20),          -- 'Pending', 'In Progress', 'Resolved'
    image_path VARCHAR(300),
    user_id INTEGER,
    created_at DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Issues
- `GET /api/authority_issues` - Get issues for authority's block
- `GET /api/community_feed` - Get all issues (public feed)
- `GET /api/my_issues` - Get current user's issues
- `POST /api/mobile/report` - Submit new issue (mobile)

### Analytics
- `GET /api/analytics` - Get analytics data (filtered by authority's block)
- `GET /api/get_cri_data/<district>` - Get CRI data by district

### Locations
- `GET /api/locations` - Get all unique locations

## Setup Instructions

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install flask flask-sqlalchemy flask-login flask-cors flask-mail python-dotenv

# Configure environment variables (REQUIRED)
# Copy the example file and edit with your credentials
cp .env.example .env
# Edit .env and set:
#   - SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_hex(32))")
#   - MAIL_USERNAME (your Gmail address)
#   - MAIL_PASSWORD (Gmail App Password - see backend/ENV_SETUP.md)

# For detailed setup instructions, see: backend/ENV_SETUP.md

# Initialize database
python
>>> from app import app, db
>>> with app.app_context():
>>>     db.create_all()
>>> exit()

# Run server
python app.py
# Server runs on http://0.0.0.0:8000
```

**⚠️ Security Note:** Never commit your `.env` file! It contains sensitive credentials. See `SECURITY_AUDIT.md` for security best practices.

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
# Server runs on http://localhost:5173

# Build for production
npm run build
```

### Mobile Setup
```bash
cd fixity_mobile

# Get dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build APK (Android)
flutter build apk

# Build iOS
flutter build ios
```

## Configuration

### Backend Environment Variables

**IMPORTANT:** The backend requires proper environment variable configuration.

Create `.env` file in `backend/` directory (use `.env.example` as template):

```env
# Required: Flask secret key for session encryption
SECRET_KEY=generate-using-python-secrets-module

# Required: Email credentials for OTP verification
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password

# Optional: Database configuration
DATABASE_URL=sqlite:///fixity.db  # or PostgreSQL URL

# Optional: Flask environment
FLASK_ENV=development
```

**For detailed setup instructions with security best practices, see:**
- `backend/ENV_SETUP.md` - Complete environment setup guide
- `SECURITY_AUDIT.md` - Security audit and recommendations

**⚠️ NEVER commit `.env` files to version control!**

### Mobile API Configuration
Update `lib/services/api_service.dart`:
```dart
// For emulator
static const String baseUrl = 'http://10.0.2.2:5000/api';

// For real device (use your machine's IP)
static const String baseUrl = 'http://192.168.x.x:5000/api';
```

## Key Features Walkthrough

### 1. Time Escalation Display

**Location**: Authority Dashboard → Issue Cards

**What it shows:**
- Issue age: "8h ago", "1 day ago"
- Color-coded urgency
- Clock icon for urgent issues
- Next escalation countdown

**Example:**
```
ROAD HAZARD • 🕐 8h ago • 01:23 PM
┌─────────────────────────────────────┐
│ ⚠️ NEXT ESCALATION: +0.5 pts in 23m │
└─────────────────────────────────────┘
```

### 2. CRI Escalation Summary

**Location**: Authority Dashboard → CRI Card (below progress bar)

**What it shows:**
- Total count of escalating issues
- Soonest next escalation time
- Point increase prediction

**Example:**
```
CRI: 33/100
[=========>          ] STABLE CONDITION
┌─────────────────────────────┐
│ 🕐 3 escalating +0.4pts in 23m │
└─────────────────────────────┘
```

### 3. Real-Time Auto-Refresh

**Frequency**: Every 5 seconds
**Pages**: Authority Dashboard, Analytics
**Effect**: Live updates without page reload

## Production Deployment

### Backend (Flask)
1. **Use production server**: Gunicorn or uWSGI
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Database**: Migrate to PostgreSQL
3. **Security (CRITICAL)**: 
   - Set strong SECRET_KEY environment variable
   - Configure email credentials via environment variables (see `backend/ENV_SETUP.md`)
   - Enable HTTPS
   - Configure CORS properly
   - Add rate limiting
   - Review `SECURITY_AUDIT.md` for complete security checklist
   - Never use default or hardcoded credentials

### Frontend (React)
1. **Build**: `npm run build`
2. **Deploy**: Vercel, Netlify, or any static hosting
3. **Environment**: Update API URLs

### Mobile (Flutter)
1. **Update API URL** in `api_service.dart`
2. **Build**: 
   - Android: `flutter build apk --release`
   - iOS: `flutter build ios --release`
3. **Publish**: Google Play Store / App Store

## Security Considerations

- ⚠️ Change Flask SECRET_KEY in production
- ⚠️ Use environment variables for sensitive data
- ⚠️ Enable HTTPS for all endpoints
- ⚠️ Implement rate limiting
- ⚠️ Validate all user inputs
- ⚠️ Use prepared statements (SQLAlchemy ORM)
- ⚠️ Implement proper CORS policies

## Performance Optimization

1. **Database Indexing**:
```sql
CREATE INDEX idx_issue_block ON issue(block);
CREATE INDEX idx_issue_status ON issue(status);
CREATE INDEX idx_issue_created ON issue(created_at);
```

2. **Caching**: Implement Redis for frequently accessed data
3. **CDN**: Use CDN for static assets
4. **Lazy Loading**: Load images on demand

## Demo Data

The system includes **150+ realistic seeded issues** across Odisha districts for demonstration purposes.

**Test Accounts:**
- Username: admin / Password: admin (Authority role)
- Block: Bhubaneswar Ward 19
- District: Khordha

## Known Issues & Limitations

1. **Hour-based escalation**: Designed for demo; production should use days
2. **SQLite**: Development only; production needs PostgreSQL
3. **No background jobs**: Escalation recalculates on-read
4. **Single server**: No load balancing implemented

## Future Enhancements

- [ ] Push notifications for urgent issues
- [ ] SMS/Email alerts for authorities
- [ ] Machine learning for risk prediction
- [ ] Image recognition for issue verification
- [ ] Multi-language support
- [ ] Advanced analytics dashboards
- [ ] Issue clustering and pattern detection
- [ ] Public API for third-party integrations

## License

This project is developed for educational/demonstration purposes.

## Security

**⚠️ Important Security Information:**

This repository has been audited for security issues. Please review:

- **`SECURITY_AUDIT.md`** - Complete security audit report with findings and recommendations
- **`backend/ENV_SETUP.md`** - Environment variable setup guide with security best practices

**Key Security Points:**
- Never commit `.env` files or credentials to version control
- Always use environment variables for sensitive configuration
- Use strong, randomly generated SECRET_KEY values
- Use Gmail App Passwords, not regular passwords
- Review the security audit before deploying to production

## Contact & Support

For issues, questions, or contributions, please refer to project documentation or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 22, 2025  
**Status**: Production Ready
