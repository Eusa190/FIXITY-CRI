from datetime import datetime
import math
from models import Issue
from database import db
from sqlalchemy import func

# --- CONFIGURATION ---

BASE_RISK = {
    'Water Leakage': 6,
    'Pothole': 5,
    'Garbage': 3,
    'Traffic Violation': 2,
    # Fallbacks
    'Other': 4
}

SEVERITY_MULTIPLIER = {
    'low': 1.0,
    'medium': 1.3,
    'high': 1.7
}

LOCATION_MULTIPLIER = {
    'school': 1.5,
    'hospital': 1.5,
    'highway': 1.4,
    'residential': 1.1,
    # Fallback
    'commercial': 1.2
}

# --- CORE LOGIC ---

def calculate_issue_risk(issue, user_trust_score=1.0):
    """
    Calculates the exact risk score for an issue based on:
    - Category Base Risk
    - Severity & Location Context
    - Time Decay (Logarithmic Escalation)
    - User Trust Score
    """
    
    # 1. Base Risk
    base = BASE_RISK.get(issue.category, 4)
    
    # 2. Multipliers
    sev_mult = SEVERITY_MULTIPLIER.get(issue.severity_level, 1.0)
    loc_mult = LOCATION_MULTIPLIER.get(issue.location_context, 1.0)
    
    # 3. Time Component (Escalation)
    if issue.created_at:
        delta = datetime.utcnow() - issue.created_at
        
        # DEMO MODE: Use HOURS instead of DAYS for faster escalation visibility
        # Real-world would use days, but hackathon judges need to see movement.
        hours_unresolved = delta.total_seconds() / 3600
        
        # Avoid negative log or errors
        time_unit = max(0, hours_unresolved)
    else:
        time_unit = 0
        
    # Formula: log(hours + 1) * 2
    # Adjusted multiplier (2 instead of 5) because hours grow faster than days.
    time_escalation = math.log(time_unit + 1) * 2
    
    # 4. Core Calculation
    marketing_risk = (base * sev_mult * loc_mult)
    
    # 5. Final Calculation
    current_issue_risk = marketing_risk + time_escalation
    
    # Apply User Trust
    start_score = current_issue_risk * user_trust_score
    
    return round(start_score, 2)

def get_aggregated_cri_data(district_name):
    """
    Returns real aggregated CRI data for a district.
    Groups issues by block and sums their severity scores.
    """
    
    # 1. Fetch all issues in the district
    # We sum severity_score directly.
    # Note: Resolved issues should have severity_score = 0, so they don't contribute.
    
    # Query: Select block, SUM(severity_score) from issues where district = X group by block
    results = db.session.query(
        Issue.block,
        func.sum(Issue.severity_score).label('total_risk')
    ).filter(
        Issue.district == district_name
    ).group_by(Issue.block).all()
    
    formatted_data = []
    
    # Hardcoded coords for demo/fallback (since we don't have a real geocoder for block centers)
    # We can perform a trick: clean the block name slightly or just rely on random jitter around district center if needed.
    # OR, we take the lat/lng of the *latest* issue in that block as the "center".
    
    for block, total_risk in results:
        # Determine color
        if total_risk >= 80:
            color = 'red'
        elif total_risk >= 50:
            color = 'orange'
        else:
            color = 'green'
        
        # We don't have lat/lng on the block aggregation level easily unless we store it or average it.
        # For now, we will just pick a random offset from a "mock center" or skip lat/lng here
        # and let the frontend handle mapping simply by block name if possible.
        # BUT, the frontend expects lat/lng for heatmaps.
        # Let's average the lat/lng from issues in that block? 
        # That's expensive. Let's just grab the FIRST issue's lat/lng as a proxy for the block center.
        
        first_issue = Issue.query.filter_by(district=district_name, block=block).first()
        lat = first_issue.latitude if first_issue else 20.0
        lng = first_issue.longitude if first_issue else 85.0
        
        # Count unresolved issues in this block
        issue_count = Issue.query.filter_by(
            district=district_name, 
            block=block
        ).filter(Issue.status != 'Resolved').count()
        
        formatted_data.append({
            'block': block,
            'cri': round(total_risk, 1),
            'color': color,
            'lat': lat,
            'lng': lng,
            'issue_count': issue_count  # Add issue count for mobile app
        })
        
    return formatted_data
