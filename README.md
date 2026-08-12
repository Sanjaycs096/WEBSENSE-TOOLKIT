# 🌐 WebSense Toolkit

> A modern, all-in-one Internet Utility & Digital Safety Platform helping users analyze their network exposure, website security, password strength, and AI content authenticity — all from a single, clean dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-11-F6820D)

---

## 🚀 Overview

WebSense Toolkit provides an **at-a-glance understanding of your digital safety** using a unified score and multiple intelligent tools designed for developers, students, and everyday users.

---

## ✨ Key Features

### 🔢 Unified Digital Safety Score
- A **0–100 score** representing your overall digital safety
- Risk classification: *Poor / Fair / Good / Excellent*

### 🌍 Network & IP Analysis
- Detects **IPv4 & IPv6** addresses
- IP geolocation (country, ISP, ASN)

### 🌐 URL & Website Analyzer
- Website safety analysis
- SSL certificate validation and HTTP security headers check

### 🔐 Password Toolkit
- **Password Strength Checker** (entropy-based)
- **Secure Password Generator**
- 100% client-side — passwords are **never sent or stored**

### 🧠 AI Image Authenticity Checker
- Detect whether an image is **AI-generated or real** using Google GenAI (Genkit)
- Confidence score with explanation

### 👤 User Authentication
- Secure sign-up & login using **Firebase Authentication**

---

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend/Database**: Firebase (Authentication, Firestore, App Hosting)
- **AI Integration**: Genkit with Google GenAI

---

## 🧱 Project Structure

```txt
websense-toolkit/
├── src/
│   ├── app/           # Next.js App Router Pages
│   ├── components/    # Reusable UI Components
│   ├── hooks/         # Custom React Hooks
│   ├── lib/           # Utilities
│   ├── firebase/      # Firebase Configuration
│   └── ai/            # Genkit AI Integrations
├── public/            # Static Assets
├── docs/              # Documentation
├── .github/           # GitHub Actions workflows & templates
└── tailwind.config.ts # Tailwind CSS configuration
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- Firebase Account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/websense-toolkit.git
cd websense-toolkit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and fill in your Firebase credentials.
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Navigate to `http://localhost:9002` (or the port shown in your terminal).

---

## 🛡️ Privacy & Security First

WebSense Toolkit is built with **privacy as a core principle**:
- ❌ Passwords are never stored or transmitted
- ❌ Images are not permanently saved
- ✅ User data is isolated and protected

---

## 📜 License

This project is licensed under the MIT License.
