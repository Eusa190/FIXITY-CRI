
# PowerShell Script to Validate Auth Flow
$ErrorActionPreference = "Stop"

# 1. Register Authority
Write-Host "1. Registering Authority..."
$reg_body = @{
    username = "ValidationOfficer"
    email = "valid@gov.in"
    password = "password123"
    state = "Maharashtra"
    district = "Pune"
    block = "Wakad"
} | ConvertTo-Json

$reg_resp = Invoke-WebRequest -Uri "http://localhost:8000/api/register/authority" -Method POST -ContentType "application/json" -Body $reg_body -UseBasicParsing
Write-Host "Register Status: $($reg_resp.StatusCode)"

# 2. Login Authority (Capture Session)
Write-Host "`n2. Logging in..."
$login_body = @{
    email = "valid@gov.in"
    password = "password123"
} | ConvertTo-Json

$login_resp = Invoke-WebRequest -Uri "http://localhost:8000/api/login" -Method POST -ContentType "application/json" -Body $login_body -SessionVariable "ses" -UseBasicParsing
Write-Host "Login Status: $($login_resp.StatusCode)"
Write-Host "Response: $($login_resp.Content)"

# 3. Access Protected Route
Write-Host "`n3. Checking /api/me..."
$me_resp = Invoke-WebRequest -Uri "http://localhost:8000/api/me" -WebSession $ses -UseBasicParsing
Write-Host "Me Status: $($me_resp.StatusCode)"
Write-Host "User Data: $($me_resp.Content)"

Write-Host "`n--- AUTH FLOW VERIFIED ---"
