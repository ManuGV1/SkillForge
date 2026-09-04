# DEVELOPMENT ROADMAP: SKILLFORGE

This document defines the chronological path for building **SkillForge** from scratch. It is divided into 9 sequential phases to ensure stability, proper database integration, and high visual quality.

---

## Phase 1: Foundation & Landing Page (Current Phase)
* **Goal**: Establish the repository structure, Design System styling, documentation, and the landing page.
* **Deliverables**:
  - [x] Create core specifications (`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DESIGN_SYSTEM.md`).
  - [ ] Initialize Next.js project with TypeScript and Tailwind CSS.
  - [ ] Configure global styles (`globals.css`) with CSS variables for the Design System tokens.
  - [ ] Build the editorial landing page (Hero, Roadmap Discover, Learning System, Practice teaser, Project Hub, Placement/Resume Builder teaser, Code404 signature).
  - [ ] Ensure fully responsive design across Mobile, Tablet, and Desktop.
  - [ ] Run verification tests and linting.

---

## Phase 2: User Authentication & Database Integration
* **Goal**: Enable student registration, login, profile customisation, and persistent storage.
* **Deliverables**:
  - [ ] Initialize Prisma ORM, configure PostgreSQL connection pool.
  - [ ] Create database migration for Users, Roles, and Profiles schemas.
  - [ ] Implement NextAuth.js (Email + Password and GitHub Provider).
  - [ ] Build User Profile onboarding flow (career goals selection: e.g., Backend Developer).
  - [ ] Create Student Dashboard skeleton loading from active user session.

---

## Phase 3: Career Roadmaps & Learning Management System (LMS)
* **Goal**: Implement course modules, interactive roadmap navigation, and resource downloads.
* **Deliverables**:
  - [ ] Seed database with initial Career Roadmaps (e.g. Software Engineer, Frontend Developer) and first 3 courses.
  - [ ] Build interactive Roadmap Path component on the frontend.
  - [ ] Implement Lesson reader page supporting Markdown contents, video embeds, and resource files.
  - [ ] Build tracking engine to mark lessons complete (`progress` table).

---

## Phase 4: Practice Engine & Coding Sandbox
* **Goal**: Introduce quizzes and interactive in-browser coding tests.
* **Deliverables**:
  - [ ] Create interactive Multiple Choice Quiz component.
  - [ ] Integrate code editor workspace (e.g., Monaco Editor or simple CodeMirror editor).
  - [ ] Build API Route Handler to securely execute and verify code attempts (Docker sandbox or API-based validator).
  - [ ] Implement submissions tracker showing pass/fail status.

---

## Phase 5: Project Hub (The Forge)
* **Goal**: Introduce task-oriented guided portfolios.
* **Deliverables**:
  - [ ] Design the Projects Explorer displaying active projects, difficulties, and target languages.
  - [ ] Build Project Detail view containing task-by-task checkboxes.
  - [ ] Enable students to submit GitHub Repository URLs for project validation.

---

## Phase 6: Placement Prep & Resume Builder
* **Goal**: Provide career resources, company QA bank, and ATS-friendly resume formatting.
* **Deliverables**:
  - [ ] Build Interview Prep bank search page sorted by Company, Role, and difficulty.
  - [ ] Implement Resume Builder pulling data from Profile (bio, GitHub, completed roadmaps/projects).
  - [ ] Add resume print styles and PDF export engine.

---

## Phase 7: Cryptographic Certificates & Verification Portal
* **Goal**: Build the secure certificates issuing and public verification system.
* **Deliverables**:
  - [ ] Write certificate signing utility generating unique hashes.
  - [ ] Build Certificate Viewer with high-end editorial styling, print layouts, and digital seals.
  - [ ] Develop the public Certificate Verification landing page.

---

## Phase 8: Premium Billing & Subscriptions
* **Goal**: Add monetization layer for advanced paths and resources.
* **Deliverables**:
  - [ ] Integrate Stripe webhook endpoints.
  - [ ] Define pricing tiers (Free vs Premium paths).
  - [ ] Implement premium routing gates across courses, projects, and advanced mock interview modules.

---

## Phase 9: Advanced Ecosystem Features
* **Goal**: Polish, audit trails, analytics, and administrator controls.
* **Deliverables**:
  - [ ] Build the separate secure Administrator dashboard (Manage courses, audit logs, reviews moderation).
  - [ ] Implement course rating and reviews component.
  - [ ] Setup production monitoring, performance caching, and accessibility audits.
