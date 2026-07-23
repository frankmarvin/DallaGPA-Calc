## 🎓 DallaGPA Calc – Enterprise GPA & CGPA Management System

This project is proprietary and confidential. Unauthorized copying, distribution, modification, deployment, or use of this software is strictly prohibited without prior written permission from the owner.»

---

## 📖 About

DallaGPA Calc is a production-grade academic performance management platform built for Kenyan universities. It enables students, lecturers, and administrators to calculate semester GPAs, cumulative CGPAs, predict degree classifications, generate professional transcripts, and access deep academic analytics.

The platform is designed to simplify academic performance management through a secure, scalable, and user-friendly system suitable for higher education institutions across Kenya.

This system is intended solely for internal use by the original licensee. The source code is provided exclusively for evaluation and reference purposes to the intended recipient and must not be copied, redistributed, deployed, or used without prior written authorization.

---

 ## ✨ Features
 
 ---
 
# Authentication & User Management

- Multi-role authentication (Student, Lecturer, and Administrator)
- Secure login and authentication
- Role-Based Access Control (RBAC)

# Academic Management

- Real-time GPA and CGPA calculation
- Support for multiple Kenyan university grading systems
- Automatic degree classification prediction (First Class, Upper Second, Lower Second, Pass, etc.)
- Course management (Add, Edit, Delete, Search)
- Department and academic year management

# Transcript & Reporting

- Professional PDF transcript generation
- QR Code verification
- Digital signature support
- Export reports in PDF, Excel, and CSV formats

# Dashboards & Analytics

- Interactive dashboards
- Academic performance trends
- GPA and CGPA visualization charts
- Student performance analytics

# Notifications

- Email notifications
- Results publication alerts
- Low GPA warnings
- Academic announcements

# User Experience

- Responsive design
- Progressive Web App (PWA) support
- Dark Mode and Light Mode
- Fast and intuitive user interface

---

## 🧰 Tech Stack

|Layer    | Technology                                                                               |
|---------|------------------------------------------------------------------------------------------|
|Frontend | React (Vite), TypeScript, Tailwind CSS, Zustand, TanStack Query, Recharts, Framer Motion |
|Backend  | Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt, Nodemailer                        |
|Database | PostgreSQL (Supabase / Neon)                                                             |
|DevOps   | Docker, Docker Compose, GitHub Actions CI/CD                                             |

---

## ⚠️ License & Usage Restrictions

This software and its source code are the exclusive intellectual property of DallaGPA.

By accessing this repository, you acknowledge and agree to the following terms:

- No Deployment – You may not deploy, host, or publish this application on any public or private server.
- No Modification – You may not modify, adapt, reverse engineer, or create derivative works from this software.
- No Redistribution – You may not copy, share, sublicense, or distribute this project or any portion of its source code.
- No Commercial Use – You may not use this software for any commercial, business, or revenue-generating purpose.
- Evaluation Only – This repository is provided solely for internal evaluation and reference by the authorized recipient.

Unauthorized use of this software may result in legal action under applicable copyright and intellectual property laws.

For licensing inquiries; 
Contact: 
marvinfrank2680@gmail.com

---

## 🚀 Setup (For Authorized Developers Only)

The following instructions are provided exclusively for the licensee's internal development team. Unauthorized persons must not attempt to run or deploy this system.»

# Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (Optional)

# Environment Variables

Copy the example environment files into both the backend and frontend directories.

backend/.env.example → backend/.env

frontend/.env.example → frontend/.env

# Fill in the required configuration values, including:

- Database URL
- JWT Secret Keys
- Email Credentials
- Application URLs
- Other required environment variables

---

# Backend
```bash
cd backend

npm install

npx prisma migrate dev

npm run dev
```

---

# Frontend
```bash
cd frontend

npm install

npm run dev
```

---

# Docker
```bash
docker compose up -d
```

---

## 📚 API Documentation

API endpoints are documented using Swagger/OpenAPI.

When the backend is running, documentation is available at:

```bash
/api-docs
```

Access is restricted to authorized users only.

---

## 📄 Transcript Generation

DallaGPA Calc generates professional PDF transcripts containing:

- University branding
- Student information
- Course results
- Semester GPA
- Overall CGPA
- Final degree classification
- QR Code verification
- Digital signature placeholder

---

## 🔒 Security

The platform incorporates modern security best practices, including:

- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Password hashing using bcrypt
- Helmet security middleware
- Rate limiting
- CSRF protection
- Input validation
- SQL injection prevention
- Secure cookies
- Audit logging for sensitive operations

---

## 👨‍💻 Made By

Dalla Development Team

|Role                   | Team Member          | 
|-----------------------|----------------------|
|Lead Developer         | Marvin Frank Otieno  |
|Architecture & Backend | Abby Wallance        |
|Frontend & UI/UX       | Benedict Mwangi      | 
|Database & DevOps      | James Gategi Mburu   |

This project was crafted with precision, security, and scalability in mind exclusively for the Kenyan higher education sector.

All intellectual property remains the exclusive property of the DallaGPA Development Team.

---

## 📞 Contact

For support, permissions, partnerships, or licensing inquiries:

Email: marvinfrank2680@gmail.com

Phone: +254 748 642 275

---

## 🏛️ Legal Notice

This project is protected under applicable copyright laws and international intellectual property treaties.

Unauthorized reproduction, modification, distribution, deployment, or commercial use of this software, in whole or in part, is strictly prohibited without prior written permission from the copyright owner.

Violations may result in civil and criminal penalties to the fullest extent permitted by law.

---

© 2026 DallaGPA. All Rights Reserved.
