from app import app, db, Issue

with app.app_context():
    issues = Issue.query.filter(Issue.status != 'Resolved').all()
    print(f"Active Issues: {len(issues)}")
    for i in issues:
        print(f"ID: {i.id}, Seg: {i.category}, Score: {i.severity_score}, Status: {i.status}")
    
    total = sum(i.severity_score for i in issues)
    print(f"Total Risk Sum: {total}")
    cri = min(100, int(total))
    print(f"Calculated CRI: {cri}")
