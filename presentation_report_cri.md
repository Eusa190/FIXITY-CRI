# FIXITY (Civic Risk Index) — Exhibition Presenter Report

**Purpose:** This document provides a structured, point-by-point breakdown of the Fixity system to prepare the presenter for exhibition. It covers the core concept, technical workflow, user roles, and key narrative points.

---

## 1. What is CRI (Civic Risk Index)?
**The Core Pitch:** "Civic neglect is no longer invisible. It is measurable risk."

*   **Definition:** CRI is a real-time accountability metric that transforms qualitative citizen complaints into a quantitative risk score (0-100).
*   **Not Just Complaints:** It is **not** a grievance redressal portal. It is a **Risk Intelligence System**. It measures the *danger* posed by unresolved issues.
*   **The Stick, Not the Carrot:** Unlike standard apps that just list problems, CRI applies pressure. An unresolved pothole isn't just a pothole; it is an increasing risk factor for the jurisdiction.

## 2. Key Logic & Metrics
The system is built on a mathematical risk engine (`cri_engine.py`), not just a list.

### Risk Factors (The "Why")
The score is calculated based on four weighted parameters:
1.  **Volume:** Total number of active issues.
2.  **Severity:** A weighted score (e.g., Open Manhole > Garbage Pile).
3.  **Location Context:** Higher risk if near sensitive zones (Schools, Hospitals, Highways).
4.  **Duration (Time Decay):** *Critical Differentiator.* Risk grows logarithmically over time. An old issue is "riskier" than a new one because it shows systemic negligence.

### The Thresholds (The "When")
*   **0-49 (Stable):** Normal civic friction.
*   **50-79 (Elevated - ORANGE):** Monitoring required. Jurisdiction is flagged.
*   **80-99 (Critical - RED):** Immediate escalation. Automatic notifications sent to oversight bodies.
*   **100 (SYSTEM FAILURE - BLACK):** Total systemic breakdown. Response mandatory.

## 3. The Workflow (Step-by-Step)

### Step 1: Citizen Evidence (The Input)
*   **Action:** Citizen takes a photo of a civic issue (pothole, debris, broken light).
*   **Verification:** System checks geolocation and user `Trust Score`.
*   **Impact:** The issue is immediately plotted on the **Live Map**.

### Step 2: Automatic Calculation (The Engine)
*   The `CRI Engine` assigns a base score (e.g., 5.0).
*   **Real-Time Update:** If the issue is near a school (+1.5x) and high severity (+1.7x), the score jumps.
*   **Daily Escalation:** Every 24 hours, the score increases automatically via the time-decay algorithm.

### Step 3: Authority Action (The Response)
*   **Dashboard View:** Authorities see a "Tactical View" — not a list of complaints, but a "Risk Heatmap".
*   **Resolution:** They must physically fix the issue and upload proof to "Close" the ticket.
*   **Result:** Only *verified resolution* lowers the CRI score.

## 4. Roles: Who is Doing What?

### 👤 The Citizen (Reporter)
*   **Role:** The "Sensor" of the city.
*   **Action:** Uploads evidence.
*   **Motivation:** Wants to see their neighborhood's risk score go down.
*   **Key Feature:** "Risk Accumulation Timeline" — they can watch their report grow in importance simply by waiting.

### 🛡️ The Authority (Responder)
*   **Role:** The "Mitigator".
*   **Action:** Acknowledges receipt, assigns to departments (Sanitation, Works, Electrical), and marks as resolved.
*   **Motivation:** Needs to keep their jurisdiction's CRI below 50 to avoid "Critical" flags.
*   **Key Feature:** "Authority Console" with live average response time metrics.

### 🤖 The System (Arbiter)
*   **Role:** The "Judge".
*   **Action:** Automatically calculates scores, triggers escalations, and audits performance.
*   **Neutrality:** "Risk does not negotiate." It only responds to data.

## 5. The Closing Stat (The "Mic Drop")

**Use this statement to end the presentation:**

> *"In most systems, if you ignore a problem, it goes away. In Fixity, if you ignore a problem, it grows.
> We use a logarithmic time-decay algorithm (`log(days + 1) * 5`) which ensures that **apathy is mathematically impossible to hide.**
>
> **Accountability is no longer optional. It is inevitable.**"*
