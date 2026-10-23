# Shri PinnakeEdge Smart LMS — Installation & Setup Guide

This document provides detailed instructions for setting up, configuring, and deploying the **Shri PinnakeEdge Smart LMS** application.

---

## 1. System Requirements

- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: v20.x or v22.x LTS (Recommended: Node.js 22.19.0+)
- **Package Manager**: npm v10+ (or pnpm / yarn)
- **Database (Optional for production cloud)**: Supabase PostgreSQL account

---

## 2. Installation Steps

### Step 1: Open the Project Directory
```powershell
cd "c:\Users\panda\Desktop\SHRI PINNAKEDGE\shri-pinnakedge-app"
```

### Step 2: Install Node Dependencies
Use the `--legacy-peer-deps` flag to ensure compatibility with React 19:
```powershell
npm install --legacy-peer-deps
```

---

## 3. Environment Variables Configuration

Duplicate `.env.example` to create `.env.local`:
```powershell
copy .env.example .env.local
```

Edit `.env.local` with your preferred values:
```env
NEXT_PUBLIC_APP_NAME="Shri PinnakeEdge Smart LMS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# (Optional) Supabase Production Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

> **Note**: Even without an external Supabase account connected, the application operates with a transactional database engine (`DatabaseService`) pre-populated with 100+ students, 10 faculty members, 8 courses, 6 batches, attendance, exams, assignments, and audit logs.

---

## 4. Running the Application Locally

Start the Next.js development server:
```powershell
npm run dev
```

Visit **http://localhost:3000** in your web browser.

---

## 5. Setting Up Supabase Database (For Cloud Deployment)

If you wish to deploy the relational PostgreSQL database to Supabase:

1. Create a new project at [Supabase](https://supabase.com/).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Run the schema migration in order:
   - Copy contents of `supabase/migrations/20261018000001_initial_schema.sql` and click **Run**.
   - Copy contents of `supabase/migrations/20261018000002_rls_policies.sql` and click **Run**.
4. (Optional) Run `supabase/seed.sql` to populate sample academic data into your live PostgreSQL tables.
5. In **Project Settings** > **API**, copy your `Project URL`, `anon public` key, and `service_role` secret to `.env.local`.

---

## 6. Running Automated Tests

Run the full Vitest automated test suite:
```powershell
npm run test
```

To run tests in watch mode:
```powershell
npx vitest
```

---

## 7. Production Build & Deployment

To verify that the code compiles cleanly for production:
```powershell
npm run build
```

To start the production server:
```powershell
npm run start
```

---

## 8. Role Portals Overview & Demo Login

| Portal | URL Path | Demo Login Button |
| :--- | :--- | :--- |
| **Public Website** | `/` | — |
| **Login Portal** | `/login` | Has 4 one-click demo buttons |
| **Principal Portal** | `/principal` | Click "Demo Principal" |
| **Chairman Portal** | `/chairman` | Click "Demo Chairman" |
| **Teacher Portal** | `/teacher` | Click "Demo Teacher" |
| **Student Portal** | `/student` | Click "Demo Student" |
