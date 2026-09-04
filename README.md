# SkillForge 🚀

> **An AI-powered learning and career platform for students to build skills, practice consistently, and prepare for real-world opportunities.**
>
> **Built by Code404.**

<p align="center">
  <a href="https://skill-forge-bf7b.vercel.app/"><strong>🌐 Live Demo</strong></a>
  &nbsp; • &nbsp;
  <a href="https://github.com/ManuGV1/SkillForge"><strong>💻 Source Code</strong></a>
</p>

---

## 📌 About SkillForge

SkillForge is a full-stack learning platform built around a simple idea: **make a student's technical journey more structured, practical, and easier to track.**

Instead of keeping learning roadmaps, DSA practice, projects, placement preparation, resources, notes, and progress in different places, SkillForge brings them together into one platform.

The platform is designed to help students move from **learning → practicing → building → preparing → growing**.

---

## ✨ What SkillForge Offers

### 🧭 Structured Learning Roadmaps

Follow a progressive learning path with levels and sequential access so that students can build their fundamentals before moving forward.

### 💻 DSA Practice

Practice data structures and algorithms through a dedicated problem-solving experience designed to encourage consistent practice and progression.

### 📚 Courses & Resources

Keep useful learning material, courses, references, and video resources organized in one place instead of searching across multiple platforms.

### 🛠️ Projects

Turn concepts into practical work through project-based learning and use those projects to strengthen a technical portfolio.

### 🎯 Placement Preparation

Access placement-focused preparation resources and organize technical learning around career goals.

### 📊 Progress & Analytics

Track learning activity and progress so students can understand where they are improving and where they need more practice.

### 🤖 AI-Powered Learning Assistance

Gemini-powered AI assistance helps make learning more interactive by providing guidance, explanations, hints, and support when students get stuck.

### 🔐 Authentication

Secure authentication with support for:

- Google Sign-In
- Email & password authentication
- Session-based access

### 📝 Notes & Learning Tools

Create and manage personal notes while learning, with additional tools designed to support day-to-day technical practice.

### 👤 Profile & Personal Progress

Keep learning activity and progress connected to an individual student profile.

### 🛡️ Admin & Superadmin

Administrative capabilities are included for managing platform content and overseeing the application.

### 💬 Support & Community

Students can reach out through the support system, while the project also provides information about the team behind SkillForge.

---

## 🧠 Why SkillForge?

Students often have to switch between roadmaps, coding platforms, YouTube videos, notes, project ideas, placement resources, and different productivity tools.

**SkillForge brings that journey into one focused workspace.**

The goal isn't to replace every platform a student uses. The goal is to provide a structured place where students can understand **what to learn next, practice it, build something with it, and keep moving toward their career goals.**

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js server-side architecture |
| Authentication | Auth.js / NextAuth |
| Database | PostgreSQL |
| ORM | Prisma |
| AI | Gemini AI |
| Validation | Zod |
| Email | Nodemailer |
| Deployment | Vercel |

---

## 🔑 Core Highlights

- Full-stack Next.js application
- PostgreSQL database with Prisma ORM
- Google and email/password authentication
- AI-powered learning assistance
- Structured multi-level learning roadmap
- DSA practice environment
- Courses and curated learning resources
- Project-based learning
- Placement preparation
- Progress tracking and analytics
- Personal notes
- Admin and Superadmin functionality
- Responsive, modern student-focused UI
- Production deployment on Vercel

---

## 🗂️ Project Structure

```text
SkillForge/
├── app/              # Application routes and UI
├── components/       # Reusable UI components
├── lib/              # Shared utilities and services
├── prisma/           # Prisma schema and database seed
├── public/           # Static assets
├── types/            # TypeScript types
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ManuGV1/SkillForge.git
cd SkillForge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and configure the required application secrets and service credentials, including your PostgreSQL connection, authentication configuration, Google OAuth credentials, and Gemini AI configuration.

**Never commit your `.env` file or expose production secrets.**

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Sync the database

```bash
npx prisma db push
```

### 6. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🌐 Live Project

**SkillForge is deployed and available online:**

👉 https://skill-forge-bf7b.vercel.app/

Try the platform, create an account, explore the features, and share feedback or report anything that can be improved.

---

## 🔒 Security Notes

- Environment variables and secrets should remain outside version control.
- Production credentials should never be committed to the repository.
- Authentication and database configuration should be supplied through environment variables.

---

## 📈 Project Vision

SkillForge is being developed as more than a collection of learning pages. The long-term vision is to create a **student-focused technical growth platform** where learning, practice, projects, career preparation, and AI assistance work together.

The current release is a foundation that can continue evolving through real student feedback, new learning content, better analytics, and improved learning experiences.

---

## 👨‍💻 Built by Code404

SkillForge is a project developed by **Code404**, with a focus on building practical technology that helps students learn, practice, and prepare for the next step in their careers.

---

## ⭐ Feedback

If you try SkillForge, feedback is genuinely welcome.

Found a bug? Have an idea? Think something could be improved?

**Open an issue or share your feedback.** Every useful suggestion helps shape the next version of SkillForge.

---

<p align="center">
  <strong>Learn. Practice. Build. Prepare. Grow. 🚀</strong>
</p>
