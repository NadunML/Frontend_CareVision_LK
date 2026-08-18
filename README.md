# CareVision LK - Frontend Command Dashboard

CareVision LK is an enterprise-grade, AI-powered surveillance and security management system designed for healthcare environments. This repository contains the React-based frontend application that serves as the centralized command dashboard for the system.

## Core Features

* **Live Camera Grid & AI Controls:** 
  A responsive 9-camera layout that streams real-time MJPEG feeds from the Edge Server. Includes interactive UI controls to toggle Patient Identification, Mask Detection, and Fire Detection modules per camera.

* **Emergency Lockdown Protocol:** 
  Dynamically responds to fire alerts by visually locking down non-essential AI modules (Patient and Mask detection) on the dashboard, ensuring the system prioritizes the emergency response.

* **Secure Access & Session Management:** 
  Integrated with Firebase Authentication, strictly restricting system access to authorized university personnel (e.g., `@ms.sab.ac.lk` domains). Features a secure teardown process that automatically terminates all Edge Server camera connections upon user logout.

* **Comprehensive Alert & Patient Management:** 
  Allows administrators to register high-risk patients with facial reference images, monitor real-time access control logs, resolve active system alerts, and generate downloadable PDF operational reports.

## Technology Stack

* **Core Framework:** React.js powered by Vite for a blazing-fast, component-based user interface.
* **Authentication:** Firebase Auth for secure, domain-restricted user login.
* **Styling & UI:** Custom CSS3 with Lucide React for modern, lightweight iconography.
* **Data Fetching:** Axios and native Fetch API for seamless asynchronous communication with the backend.

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* A running instance of the CareVision LK Backend Server

### Setup Instructions

1. **Clone the repository and navigate to the frontend directory.**

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    Create a `.env` file in the root directory and configure your backend API URL and Firebase credentials:
    ```env
    VITE_API_URL=http://localhost:5000
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4. **Start the Development Server:**
    ```bash
    npm run dev
    ```
    *(Note: The frontend will typically be available at `http://localhost:5173`.)*
