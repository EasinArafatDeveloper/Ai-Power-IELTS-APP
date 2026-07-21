# AI IELTS Coach - MVP Web Application

A premium, AI-powered IELTS preparation platform designed to guide students from their current English proficiency level to their target IELTS band score through personalized study guidance, diagnostic assessments, and detailed AI feedback.

This repository contains the production-grade MVP Web Application built using a modern monorepo folder structure.

---

## 🚀 Tech Stack

### Frontend (Web Client)
* **Framework**: Next.js 15 (App Router, TypeScript)
* **Styling**: Tailwind CSS, shadcn/ui components (Radix UI base)
* **Animations**: Framer Motion & GSAP
* **State & Data Fetching**: TanStack Query (React Query) & Axios
* **Form Validation**: React Hook Form & Zod
* **Icons & Notifications**: Lucide Icons & React Hot Toast

### Backend (REST API Core)
* **Framework**: NestJS (TypeScript, Node.js)
* **Database**: MongoDB Atlas via Mongoose ORM
* **Authentication**: Firebase Authentication & Custom JWT guards
* **AI Provider**: Google Gemini / DeepSeek API integration (modular provider structure)
* **Security & Reliability**: Helmet, CORS policies, ValidationPipe, and rate-limiting

---

## 📁 Repository Structure

```
IELTS APP/
├── backend/            # NestJS Backend API
│   ├── src/
│   │   ├── ai/         # Gemini / DeepSeek AI provider service
│   │   ├── auth/       # JWT Auth guard & Firebase verifications
│   │   ├── database/   # Mongo Mongoose repository implementations & schemas
│   │   ├── progress/   # Student score trend tracking modules
│   │   ├── study-plan/ # Personalized daily study plan engines
│   │   ├── users/      # Profile, onboarding, and placement test APIs
│   │   └── writing/    # Writing Task 1 & 2 AI evaluations
│   └── .env            # Backend env configurations
│
├── frontend/           # Next.js 15 client
│   ├── src/
│   │   ├── app/        # App Router pages (Dashboard, Onboarding, Writing Coach, etc.)
│   │   ├── components/ # Reusable UI widgets and layout views
│   │   ├── context/    # User AuthContext session management
│   │   └── lib/        # API and Firebase Web Client config utilities
│   └── .env.local      # Frontend client env configs
```

---

## ⚡ Setup & Installation

### Prerequisite: Database connection
The backend `.env` is already configured with live MongoDB cluster credentials. It works out-of-the-box.

### 1. Launch the Backend API Server
Navigate to the `backend` folder, install dependencies, and launch:
```bash
cd backend
npm install
npm run start:dev
```
*API runs on **`http://localhost:4000/api`***.

### 2. Launch the Next.js Client
Open a new terminal, navigate to the `frontend` folder, install dependencies, and launch:
```bash
cd frontend
npm install
npm run dev
```
*Web client runs on **`http://localhost:3000`***.

---

## 🛠️ Sandbox Mode Bypass (Quick Test)

To test the E2E application without configuring manual Firebase credentials immediately:
1. Open **`http://localhost:3000`** in your browser and click "Get Started" or "Sign In".
2. Locate the **Developer Sandbox Login Bypass** section at the bottom of the login card.
3. Type any mock email (e.g. `student@example.com`) and click **"Quick Sandbox Access"**.
4. You will be authenticated immediately, registered in MongoDB, and redirected to the Onboarding questionnaire flow followed by the diagnostic test!

---

## 📈 Future Expansion Roadmap
This MVP has been architected cleanly to support future releases including:
* **AI Speaking Assessment**: Integrated with Whisper API and Web Audio recorders.
* **Full Mock Exams**: Listening, Reading, Writing, and Speaking combined tests.
* **Flutter Mobile Apps**: iOS & Android apps linking directly to this backend core.
* **Subscription Management**: Stripe checkout integration.
