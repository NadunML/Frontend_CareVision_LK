# 🏥 CareVision LK - Intelligent Hospital Security System

CareVision LK is an enterprise-grade, AI-powered surveillance and security management system designed specifically for healthcare environments. By leveraging state-of-the-art Deep Learning models and an Edge-Computing architecture, the system provides real-time monitoring across multiple hospital zones without relying on high-latency cloud video processing.

## 🚀 Key Features

* **Intelligent Patient Monitoring (Cameras 1-3):** 
    * Utilizes advanced facial recognition to identify high-risk or dementia patients.
    * Triggers instant alerts if a registered patient attempts to leave designated safe zones or wards.
* **Automated Access Control & PPE Detection (Cameras 4-6):**
    * Monitors restricted areas (e.g., ICUs, Operation Theaters, Labs).
    * Detects surgical mask compliance in real-time and logs access granted/denied events.
* **Hazard Management (Cameras 7-9):**
    * Real-time fire and smoke detection for dangerous zones like chemical stores and electrical rooms.
    * Automated severity classification (Medium, High, Critical) based on detection confidence.
* **Centralized Command Dashboard:**
    * A responsive, real-time React UI capable of displaying a 9-camera live feed grid.
    * Features a comprehensive Alert Management system, Access Control logs, and downloadable PDF system reports.

## 🧠 System Architecture

CareVision LK is built on an **Edge AI Architecture**. 
To minimize network latency and reduce cloud bandwidth costs, heavy video streams are not sent to the cloud. Instead, the AI inference (YOLO, Face Recognition, MobileNet) runs locally on a hospital Edge Node (Local Server). Only structured data and critical alerts are synced to the centralized database, ensuring lightning-fast response times and high system reliability.

## 🛠️ Technology Stack

* **Frontend:** React.js (Vite), Lucide React, Axios.
* **Backend:** Python, FastAPI, OpenCV, MySQL.
* **AI Models:** YOLOv8 (Fire/Smoke), MobileNetV2 (Mask), Face_Recognition/dlib (Patients).

## 📦 Installation & Setup

### 1. Prerequisites
* Node.js (v18+)
* Python (3.9+)
* MySQL Server (Ensure your database credentials match the `.env` file)

### 2. Backend Server Initialization
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5000