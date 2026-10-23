# Shri PinnakeEdge Coaching Center — Smart LMS & Institute ERP

> **A Complete, Production-Grade Full-Stack Learning Management System & Institute ERP** built for the Principal, Chairman, Faculty Teachers, and Enrolled Students of **Shri PinnakeEdge Coaching Center**.

---

## 🏛️ Executive Summary

**Shri PinnakeEdge Smart LMS** is an enterprise-grade coaching center management platform delivering a complete academic, examination, financial, and administrative operating system. The platform replaces fragmented tools with a unified real-time portal supporting multi-role access, computer-based testing (CBT), automated grading, attendance intelligence, and fee processing.

---

## ⚡ Technology Stack

- **Framework**: [Next.js 16.4.2](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Frontend**: [React 19.3.0](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Data Visualization**: [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Database & Backend**: [PostgreSQL](https://www.postgresql.org/) / [Supabase](https://supabase.com/) with Row-Level Security (RLS) & Relational Schema
- **State & Service Layer**: Singleton In-Memory Database Service (`DatabaseService`) with real-time audit logging and transactional mutation support
- **Testing**: [Vitest](https://vitest.dev/) (Unit & Integration tests for scoring, fees, and database operations)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across entities, DTOs, and API contracts)

---

## 👥 Multi-Role Architecture

The system provides 4 dedicated role-based portals with verified permission isolation:

| Role | User Identifier | Access Scope & Key Features |
| :--- | :--- | :--- |
| **Principal** *(Super Admin)* | `principal@pinnakeedge.edu` | Full institutional authority: 100+ student directory, faculty onboarding, course/batch creation, fee balance oversight, test publishing, immutable audit logs. |
| **Chairman** *(Executive Admin)* | `chairman@pinnakeedge.edu` | Strategic executive governance: fee collection targets, revenue breakdown, enrollment projections, batch academic benchmarking. |
| **Teacher** *(Faculty Member)* | `teacher.sharma@pinnakeedge.edu` | Daily lecture timetable, bulk attendance marking (Present/Absent/Late/Leave), assignment grading, study material distribution, test scorecard authoring. |
| **Student** *(Enrolled Scholar)* | `student.aarav@pinnakeedge.edu` | Learning workspace: course schedules, lecture notes download, homework submission, live CBT online exam player with real-time scorecard, fee invoices & printable receipts. |

---

## 🎯 Core Modules & Capabilities

### 1. Computer-Based Testing (CBT) Engine
- **Timed Online Exam Interface**: Active countdown timer with automated submission at zero.
- **Question Palette**: Live visual grid tracking *Answered*, *Unanswered*, and *Current* questions.
- **Server-Authoritative Auto-Grading**: Supports single-choice MCQs and True/False questions.
- **Negative Marking Calculation**: Enforces JEE/NEET marking scheme (e.g., `+4` for correct, `-1` for incorrect).
- **Result Publication Control**: Students only see official rankings and answer keys after teacher/principal publishes results.

### 2. Smart Attendance System
- **Batch-wise Roster Grid**: One-click toggling between `Present`, `Absent`, `Late`, and `Leave`.
- **Low-Attendance Detection**: Automatic visual warnings for students with attendance `< 75%`.
- **Correction Tracking**: Teachers can update historical logs with reason remarks.

### 3. Fee & Revenue Management
- **Invoicing**: Detailed invoices with tuition fees, GST, discounts, and due dates.
- **Payment Collection**: Cash, UPI, Bank Transfer, and Card payment recording.
- **Printable Receipts**: Formal branded receipt voucher modal formatted in Indian Rupees (`₹`).

### 4. Digital Classroom & Academics
- **Study Materials Hub**: File categorized by Course, Batch, Subject, and topic with download access.
- **Assignments Workflow**: Teachers publish problem sets with deadlines; students upload text/link solutions; teachers review, assign scores, and leave feedback.

### 5. Regulatory Compliance & Audit Trail
- **Immutable Audit Logging**: Every critical mutation (student registration, attendance save, exam submission, fee payment) records timestamp, actor ID, action type, IP address, and metadata.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v20 or v22 LTS
- **npm**: v10+

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd shri-pinnakedge-app
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root folder:
```env
NEXT_PUBLIC_APP_NAME="Shri PinnakeEdge Smart LMS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Running Tests & Production Build

### Run Automated Unit & Integration Tests
```bash
npm run test
```
*Executes all 15 tests covering academic calculations, fee balances, negative exam scoring, and database CRUD operations.*

### Build for Production
```bash
npm run build
npm run start
```
*Compiles all 51 static and dynamic pages with 0 TypeScript or bundling errors.*

---

## 🗄️ Database Architecture & Migrations

All relational tables, foreign key constraints, indexes, and Row-Level Security (RLS) policies are in the `/supabase` folder:

- `supabase/migrations/20261018000001_initial_schema.sql`: Complete DDL schema (14 relational tables).
- `supabase/migrations/20261018000002_rls_policies.sql`: Role-based security policies for Principal, Chairman, Teacher, and Student.
- `supabase/seed.sql`: 100+ student records, 10 faculty teachers, 8 courses, 6 batches, attendance logs, CBT exams with questions, and financial records.

### Applying to Supabase
```bash
npx supabase db reset
# or execute migrations directly in the Supabase SQL Editor
```

---

## 🔐 Demo Credentials (1-Click Login Available)

On the `/login` page, you can either click the **One-Click Demo Login** buttons or enter the credentials below:

| Role | Email Address | Password | Direct Dashboard Link |
| :--- | :--- | :--- | :--- |
| **Principal** | `principal@pinnakeedge.edu` | `Pinnake#2026` | `/principal` |
| **Chairman** | `chairman@pinnakeedge.edu` | `Chairman#2026` | `/chairman` |
| **Teacher** | `teacher.sharma@pinnakeedge.edu` | `Faculty#2026` | `/teacher` |
| **Student** | `student.aarav@pinnakeedge.edu` | `Student#2026` | `/student` |

---

## 📜 License & Ownership
Copyright © 2026 Shri PinnakeEdge Coaching Center. All rights reserved.
