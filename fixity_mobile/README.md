# Fixity Mobile App (Flutter)

A lightweight citizen-facing mobile client for the Fixity platform, focused on rapid civic risk reporting.

## Purpose
This app serves as the "Crowd Input" terminal for the Fixity Cyclic Risk Index (CRI) system. It is intentionally minimal to ensure reporting speed and stability.

## Scope & Exclusions
- **Citizen-side only**: No authority dashboards.
- **No Auth**: Open reporting to lower friction.
- **No Analytics Charts**: Detailed analytics are reserved for the web platform.
- **One-way Flow**: Splash -> Report -> Risk Snapshot.

## Backend Connection
Connects to the centralized Python CRI backend:
- `POST /api/report`: Submits issues with photo evidence and geolocation.
- `GET /api/cri/summary`: Retrieves the current area's risk score and trend.

## Setup
1.  Ensure the backend is running at `http://localhost:5000`.
2.  Run on Android Emulator (uses `10.0.2.2` to access host localhost).
    ```bash
    flutter run
    ```
