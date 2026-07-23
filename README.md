# DallaGPA Calc – Enterprise GPA & CGPA Management System

> **© 2026 DallaGPA. All rights reserved.**  
> This project is **proprietary and confidential**. Unauthorized copying, distribution, modification, deployment, or use is strictly prohibited without prior written permission from the owner.

---

## 📖 About

**DallaGPA Calc** is a production‑grade academic performance management platform built for Kenyan universities. It enables students, lecturers, and administrators to calculate semester GPAs, cumulative CGPA, predict degree classification, generate professional transcripts, and access deep analytics.

This system is designed for **internal use only** by the original licensee. The source code is provided for evaluation and reference purposes **solely to the intended recipient**.

---

## ✨ Features

- **Multi‑role authentication** (Student, Lecturer, Admin)
- **Real‑time GPA / CGPA calculation** (supports multiple Kenyan grading systems)
- **Final degree classification prediction** (First Class, Upper Second, etc.)
- **Transcript generation** (PDF with QR code & digital signature)
- **Interactive dashboards** with charts and performance trends
- **Course management** (add, edit, delete, search)
- **Admin controls** for grading systems, departments, users, and academic years
- **Notifications & email alerts** (results published, low GPA warnings, etc.)
- **Export reports** (PDF, Excel, CSV)
- **Dark / Light mode**, responsive UI, and PWA support

---

## 🧰 Tech Stack

| Layer       | Technology                                                                               |
|-------------|------------------------------------------------------------------------------------------|
| Frontend    | React (Vite), TypeScript, Tailwind CSS, Zustand, TanStack Query, Recharts, Framer Motion |
| Backend     | Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt, Nodemailer                        |
| Database    | PostgreSQL (Supabase / Neon)                                                             |
| DevOps      | Docker, Docker Compose, GitHub Actions CI/CD                                             |

---

## ⚠️ License & Usage Restrictions

This software and its source code are **the exclusive property of DallaGPA**.  
By accessing this repository, you agree to the following terms:

- **No deployment** – You may **not** deploy, host, or make this application publicly available.
- **No modification** – You may **not** alter, adapt, or create derivative works.
- **No redistribution** – You may **not** share, sublicense, or transfer the code to any third party.
- **No commercial use** – You may **not** use this software for any business or revenue‑generating purpose.
- **Evaluation only** – You may review the code internally for the sole purpose of evaluating its functionality.

Any violation of these terms will result in immediate legal action.

For licensing inquiries, please contact **marvinfrank2680@gmail.com**.

---

## 🚀 Setup (for authorised developers only)

> The following instructions are provided **exclusively** for the licensee’s internal development team. Unauthorised persons must not attempt to run or deploy this system.

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Environment Variables
Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in the required secrets (database URL, JWT keys, email credentials, etc.).

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Docker Compose (local stack)

```bash
docker-compose up -d
```

---

📚 API Documentation

API endpoints are documented via Swagger/OpenAPI (available at /api-docs when the backend is running).
Access is restricted to authorised users only.

---

📄 Transcript Generation

Transcripts are generated as PDFs with:

· University branding
· Student details and course results
· Semester GPAs and overall CGPA
· Final degree classification
· QR code for verification
· Digital signature placeholder

---

🔒 Security

· JWT authentication with refresh tokens
· Role‑based access control (RBAC)
· Helmet, rate limiting, CSRF protection
· Input validation & SQL injection prevention
· Secure cookies and encrypted passwords
· Audit logs for all sensitive actions

---

👨‍💻 Made by

Dalla Development Team

· Lead Developer: Marvin Frank Otieno
· Architecture & Backend: Abby Wallance 
· Frontend & UI/UX: Benedict Mwangi
· Database & DevOps: James Gategi Mburu

This project was crafted with precision, security, and scalability in mind – exclusively for the Kenyan higher education sector.

For internal use only. All intellectual property remains with the DallaGPA team.

---

📞 Contact

For support, permissions, or licensing:

· Email: marvinfrank2680@gmail.com
· Tell: +254748642275

---

🏛️ Legal Notice

This project is protected by copyright law and international treaties.
Unauthorised reproduction or distribution of this software, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

© 2026 DallaGPA. All rights reserved.
