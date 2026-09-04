import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding started...");

  // =========================================================
  // 1. SEED ROLES
  // =========================================================

  const roles = [
    {
      name: "STUDENT",
      description: "Standard student learner account",
    },
    {
      name: "INSTRUCTOR",
      description: "Content creator and course instructor account",
    },
    {
      name: "ADMIN",
      description: "Platform administrator",
    },
    {
      name: "SUPER_ADMIN",
      description: "Root system owner and Code404 operator",
    },
  ];

  const dbRoles = [];

  for (const role of roles) {
    const dbRole = await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: {
        name: role.name,
        description: role.description,
      },
    });

    dbRoles.push(dbRole);

    console.log(`Role upserted: ${role.name}`);
  }

  const superAdminRole = dbRoles.find(
    (role) => role.name === "SUPER_ADMIN"
  );

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found after seed.");
  }

  // =========================================================
  // 2. SEED FOUNDER USER
  // =========================================================

  const founderEmail = "manu@code404.dev";

  const hashedPassword = await bcrypt.hash(
    "manu404code",
    10
  );

  const founderUser = await prisma.user.upsert({
    where: {
      email: founderEmail,
    },

    update: {
      name: "Manu GV",
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
    },

    create: {
      name: "Manu GV",
      email: founderEmail,
      passwordHash: hashedPassword,
      roleId: superAdminRole.id,
    },
  });

  console.log(
    `Founder user upserted: ${founderUser.email}`
  );

  // =========================================================
  // 3. SEED FOUNDER PROFILE
  // =========================================================

  await prisma.profile.upsert({
    where: {
      userId: founderUser.id,
    },

    update: {
      college: "JNNCE",
      degree: "Bachelor of Engineering",
      branch: "Information Science Engineering",
      careerGoal: "AI/ML Engineer",

      skills:
        "Python, C, JavaScript, HTML, CSS, React, Node.js, Next.js, Tailwind CSS, SQL, Git, GitHub",

      experienceLevel: "Intermediate",

      interests:
        "Artificial Intelligence, Web Development, Software Development, Automation, Hackathons",

      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",

      bio:
        "Manu GV is an Information Science Engineering student at JNNCE passionate about artificial intelligence, software development, web technologies, and building real-world projects. He founded Code404 as a student technology and hackathon team focused on building, experimenting, competing, collaborating, and creating useful technology.",
    },

    create: {
      userId: founderUser.id,

      college: "JNNCE",
      degree: "Bachelor of Engineering",
      branch: "Information Science Engineering",

      careerGoal: "AI/ML Engineer",

      skills:
        "Python, C, JavaScript, HTML, CSS, React, Node.js, Next.js, Tailwind CSS, SQL, Git, GitHub",

      experienceLevel: "Intermediate",

      interests:
        "Artificial Intelligence, Web Development, Software Development, Automation, Hackathons",

      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",

      bio:
        "Manu GV is an Information Science Engineering student at JNNCE passionate about artificial intelligence, software development, web technologies, and building real-world projects. He founded Code404 as a student technology and hackathon team focused on building, experimenting, competing, collaborating, and creating useful technology.",
    },
  });

  console.log("Founder profile upserted.");

  // =========================================================
  // 4. CODE404 TEAM MEMBERS
  // =========================================================

  const teamMembers = [
    // -------------------------------------------------------
    // MEMBER 1 — FOUNDER
    // -------------------------------------------------------
    {
      id: "550e8400-e29b-41d4-a716-446655440000",

      name: "Manu GV",
      email: "manuhegde553@gmail.com",
      role: "Founder",

      bio:
        "Manu GV is an Information Science Engineering student at JNNCE and developer passionate about AI, web development, automation, and building innovative digital products. He founded Code404 as a student technology and hackathon team focused on building, experimenting, competing, collaborating, and creating useful technology.",

      skills:
        "AI/ML, Web Development, Automation, TypeScript, C++, Python",

      githubUrl: "https://github.com",

      linkedinUrl: "https://linkedin.com",

      portfolioUrl: "https://manugv.netlify.app/",

      isFounder: true,
    },

    // -------------------------------------------------------
    // MEMBER 2 — REPLACE WHEN THEY SEND DETAILS
    // -------------------------------------------------------
    {
  id: "550e8400-e29b-41d4-a716-446655440001",

  name: "Menaka R",
  email: "gurlumanjiv@gmail.com",
  role: "Core Team Member",

  bio: "Code404 team member interested in programming and software development.",

  skills: "Python, C, C++",

  githubUrl: "https://github.com/Menaka-2826",

  linkedinUrl: "https://www.linkedin.com/in/menaka-gowda-59b73232b",

  portfolioUrl: null,

  isFounder: false,
},  

    // -------------------------------------------------------
    // MEMBER 3 — REPLACE WHEN THEY SEND DETAILS
    // -------------------------------------------------------
    {
      id: "550e8400-e29b-41d4-a716-446655440002",

      name: "Nishchith C N",
      email: null,
      role: "Core Team Member",

      bio: "Code404 team member.",

      skills: "Python,java,C,Problem Solving",

      githubUrl: "https://github.com/NischithCN",

      linkedinUrl: "https://www.linkedin.com/in/nischith-c-n-2b87b1386",
      portfolioUrl: null,

      isFounder: false,
    },

    // -------------------------------------------------------
    // MEMBER 4 — REPLACE WHEN THEY SEND DETAILS
    // -------------------------------------------------------
    {
      id: "550e8400-e29b-41d4-a716-446655440003",

      name: "Prerana U ",
      email: null,
      role: "Core Team Member",

      bio: "Code404 team member.",

      skills: "Java,froentend development",

      githubUrl: "https://www.linkedin.com/in/prerana-u-b655093b8",

      linkedinUrl: "https://github.com/preranau2706-prog",

      portfolioUrl: null,

      isFounder: false,
    },

    // -------------------------------------------------------
    // MEMBER 5 — REPLACE WHEN THEY SEND DETAILS
    // -------------------------------------------------------
    {
      id: "550e8400-e29b-41d4-a716-446655440004",

      name: "TEAM MEMBER 5",
      email: null,

      role: "Developer",

      bio: "Code404 team member.",

      skills: "To be updated",

      githubUrl: null,

      linkedinUrl: null,

      portfolioUrl: null,

      isFounder: false,
    },
  ];

  // =========================================================
  // 5. UPSERT CODE404 TEAM MEMBERS
  // =========================================================

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: {
        id: member.id,
      },

      update: {
        name: member.name,
        email:member.email,
        role: member.role,
        bio: member.bio,
        skills: member.skills,
        githubUrl: member.githubUrl,
        linkedinUrl: member.linkedinUrl,
        portfolioUrl: member.portfolioUrl,
        isFounder: member.isFounder,
      },

      create: {
        id: member.id,
        name: member.name,
        email:member.email,
        role: member.role,
        bio: member.bio,
        skills: member.skills,
        githubUrl: member.githubUrl,
        linkedinUrl: member.linkedinUrl,
        portfolioUrl: member.portfolioUrl,
        isFounder: member.isFounder,
      },
    });

    console.log(`Team member upserted: ${member.name}`);
  }

  // =========================================================
  // 6. SEED SPECIALIZATIONS & ROADMAPS (5 PATHS)
  // =========================================================

  const specializationsData = [
    {
      title: "Software Engineer",
      description: "Focus on memory management, fundamental algorithms, complex data structures, and computer science systems.",
      stages: [
        {
          title: "Foundations & C++ Fundamentals",
          description: "Master low-level programming concepts, memory pointers, manual allocation, and basic algorithmic problem solving.",
          position: 1,
          topics: [
            {
              title: "C++ Syntax, Pointers & Memory Allocation",
              description: "Understand raw pointers, stack vs heap allocation, dynamic arrays, and memory safety fundamentals.",
              youtubeUrl: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
              position: 1,
              quizJson: JSON.stringify([
                {
                  question: "Where are dynamically allocated variables stored in C++?",
                  options: ["Stack memory", "Heap memory", "CPU registers", "Static storage"],
                  answerIndex: 1
                },
                {
                  question: "Which operator is used to deallocate memory allocated with 'new'?",
                  options: ["free", "delete", "remove", "clear"],
                  answerIndex: 1
                }
              ])
            },
            {
              title: "Object-Oriented Programming in C++",
              description: "Classes, encapsulation, inheritance, polymorphism, virtual functions, and vtables.",
              youtubeUrl: "https://www.youtube.com/watch?v=wN0x9eZLup4",
              position: 2,
              quizJson: JSON.stringify([
                {
                  question: "What keyword makes a function overrideable dynamically in C++?",
                  options: ["override", "virtual", "dynamic", "abstract"],
                  answerIndex: 1
                }
              ])
            },
            {
              title: "Standard Template Library (STL) Mastery",
              description: "Vectors, maps, sets, iterators, priority queues, and algorithms in header <algorithm>.",
              youtubeUrl: "https://www.youtube.com/watch?v=g-1Cn35wLno",
              position: 3
            }
          ]
        },
        {
          title: "Data Structures & Core Algorithms",
          description: "Implement fundamental linear and non-linear data structures with time & space complexity analysis.",
          position: 2,
          topics: [
            {
              title: "Arrays, String Manipulation & Two-Pointer Patterns",
              description: "Master sliding window, prefix sums, and two-pointer array manipulation technique.",
              youtubeUrl: "https://www.youtube.com/watch?v=QZ00kL9JzYo",
              position: 1
            },
            {
              title: "Linked Lists, Stacks & Queues",
              description: "Implement singly/doubly linked lists, cycle detection, stack applications, and queue buffer implementation.",
              youtubeUrl: "https://www.youtube.com/watch?v=njTh_OwMljA",
              position: 2
            },
            {
              title: "Trees, Graphs & Traversal Algorithms",
              description: "Binary Search Trees, AVL balance, BFS, DFS, Dijkstra, and Topological Sort.",
              youtubeUrl: "https://www.youtube.com/watch?v=oSWTXtMpjAs",
              position: 3
            }
          ]
        },
        {
          title: "System Architecture & Operating Systems",
          description: "Concurrency, processes, threads, virtual memory, file systems, and lower level OS primitives.",
          position: 3,
          topics: [
            {
              title: "Multithreading, Mutexes & Deadlocks",
              description: "Learn POSIX threads, race conditions, mutex locking, semaphores, and concurrency patterns.",
              youtubeUrl: "https://www.youtube.com/watch?v=7ENFeb-J75k",
              position: 1
            },
            {
              title: "OS Memory Management & Page Tables",
              description: "Virtual memory mapping, page fault handling, segmentation, and cache coherence.",
              youtubeUrl: "https://www.youtube.com/watch?v=2quKgA3rN1k",
              position: 2
            }
          ]
        },
        {
          title: "Low-Level System Design & Optimization",
          description: "Architect high-throughput scalable C++ applications, cache locality, and profiling.",
          position: 4,
          topics: [
            {
              title: "Cache-Friendly Data Layouts & SIMD",
              description: "Data-oriented design, cache lines, memory alignment, and vectorization optimizations.",
              youtubeUrl: "https://www.youtube.com/watch?v=WDIkqP4JbkE",
              position: 1
            }
          ]
        }
      ]
    },
    {
      title: "Full-Stack Developer",
      description: "Build scalable web architectures, transactional databases, client-side hydration, and dynamic components.",
      stages: [
        {
          title: "Modern Web Frontend & TypeScript",
          description: "Master HTML5, CSS grid/flexbox, TypeScript strict typing, and modern React 19 architecture.",
          position: 1,
          topics: [
            {
              title: "HTML5, CSS3 & Responsive Design with Tailwind CSS",
              description: "Semantic layouts, CSS Grid, Flexbox, custom design tokens, and utility-first styling.",
              youtubeUrl: "https://www.youtube.com/watch?v=dFgzHOX84xQ",
              position: 1,
              quizJson: JSON.stringify([
                {
                  question: "Which Tailwind utility class applies flex direction column?",
                  options: ["flex-row", "flex-col", "flex-dir-col", "display-col"],
                  answerIndex: 1
                }
              ])
            },
            {
              title: "TypeScript Deep Dive & Strict Type Systems",
              description: "Generics, interfaces, type narrowing, utility types, and strict compiler configurations.",
              youtubeUrl: "https://www.youtube.com/watch?v=ahCwqrYpIuM",
              position: 2
            },
            {
              title: "React 19 Hooks & Client State Management",
              description: "useState, useEffect, useMemo, custom hooks, and state immutability patterns.",
              youtubeUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
              position: 3
            }
          ]
        },
        {
          title: "Next.js App Router & Server Architecture",
          description: "Server Components, Server Actions, Dynamic API Routes, Middleware, and NextAuth v5.",
          position: 2,
          topics: [
            {
              title: "Next.js 15 App Router & Server Components",
              description: "Understand server rendering, streaming SSR, layouts, loading states, and edge routing.",
              youtubeUrl: "https://www.youtube.com/watch?v=Zq5fmkH0T78",
              position: 1
            },
            {
              title: "Authentication & Authorization with NextAuth v5",
              description: "OAuth 2.0 Google sign-in, JWT strategies, edge middleware route protection, and session handlers.",
              youtubeUrl: "https://www.youtube.com/watch?v=MNm1Xh54s3o",
              position: 2
            }
          ]
        },
        {
          title: "Backend Services & Databases",
          description: "PostgreSQL, Prisma ORM, RESTful API design, connection pooling, and data validation with Zod.",
          position: 3,
          topics: [
            {
              title: "PostgreSQL Schema Design & Prisma ORM",
              description: "Relational mapping, foreign key constraints, indexes, migrations, and Prisma Client querying.",
              youtubeUrl: "https://www.youtube.com/watch?v=ReK047boFjU",
              position: 1
            },
            {
              title: "RESTful API Security, Rate Limiting & Validation",
              description: "Zod request schema parsing, HTTP status standards, CORS policies, and rate limiting.",
              youtubeUrl: "https://www.youtube.com/watch?v=L72fhGm1tfE",
              position: 2
            }
          ]
        },
        {
          title: "System Scaling, Caching & Deployment",
          description: "Redis caching, WebSocket real-time updates, Docker containerization, and CI/CD pipelines.",
          position: 4,
          topics: [
            {
              title: "Redis Sub/Pub Caching & Database Index Tuning",
              description: "In-memory caching strategies, cache invalidation patterns, B-tree DB indexes, and performance tuning.",
              youtubeUrl: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
              position: 1
            }
          ]
        }
      ]
    },
    {
      title: "AI/ML Engineer",
      description: "Develop deep neural networks, process raw tensors, refine weights, and manage data training pipelines.",
      stages: [
        {
          title: "Python Math & Scientific Stack",
          description: "Master NumPy tensor operations, Pandas data structures, linear algebra, and calculus foundations.",
          position: 1,
          topics: [
            {
              title: "NumPy Vectorization & Linear Algebra",
              description: "Matrix multiplications, broadcasting, eigenvalues, SVD decomposition, and vector math.",
              youtubeUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
              position: 1,
              quizJson: JSON.stringify([
                {
                  question: "What does broadcasting in NumPy allow you to do?",
                  options: [
                    "Perform operations on arrays of different shapes",
                    "Transmit data over sockets",
                    "Compile Python code to C",
                    "Save memory automatically"
                  ],
                  answerIndex: 0
                }
              ])
            },
            {
              title: "Pandas Data Cleaning & Exploratory Analysis",
              description: "Dataframe manipulations, missing value handling, feature engineering, and aggregations.",
              youtubeUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
              position: 2
            }
          ]
        },
        {
          title: "Classical Machine Learning",
          description: "Supervised and unsupervised learning models using Scikit-Learn.",
          position: 2,
          topics: [
            {
              title: "Supervised Models: Regression & Classification",
              description: "Linear/Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost).",
              youtubeUrl: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
              position: 1
            },
            {
              title: "Model Evaluation, Validation & Hyperparameter Tuning",
              description: "Cross-validation, precision/recall, ROC-AUC curves, confusion matrix, and grid search.",
              youtubeUrl: "https://www.youtube.com/watch?v=fSytzGwwBVw",
              position: 2
            }
          ]
        },
        {
          title: "Deep Learning & PyTorch Framework",
          description: "Neural network architectures, backpropagation, activation functions, and PyTorch tensors.",
          position: 3,
          topics: [
            {
              title: "PyTorch Autograd & Neural Network Modules",
              description: "Tensors, computation graphs, forward pass, autograd backprop, loss functions, and Adam optimizer.",
              youtubeUrl: "https://www.youtube.com/watch?v=V_xro1bcAuA",
              position: 1
            },
            {
              title: "Convolutional Neural Networks (CNNs) & Computer Vision",
              description: "Kernel convolutions, pooling, residual networks (ResNet), data augmentation, and PyTorch Vision.",
              youtubeUrl: "https://www.youtube.com/watch?v=HGwBXK4swzE",
              position: 2
            }
          ]
        },
        {
          title: "Transformers, LLMs & MLOps Deployment",
          description: "Attention mechanisms, fine-tuning HuggingFace models, model quantization, and API serving.",
          position: 4,
          topics: [
            {
              title: "Self-Attention, Transformer Architecture & HuggingFace",
              description: "Scaled dot-product attention, positional encodings, BERT/GPT architectures, and PEFT/LoRA fine-tuning.",
              youtubeUrl: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
              position: 1
            }
          ]
        }
      ]
    },
    {
      title: "DevOps & Cloud",
      description: "Automate container orchestration, manage continuous delivery pipelines, and architect high-availability servers.",
      stages: [
        {
          title: "Linux Administration & Shell Scripting",
          description: "Master Bash, systemd services, permissions, network sockets, and automated server configuration.",
          position: 1,
          topics: [
            {
              title: "Linux CLI, User Permissions & Process Control",
              description: "File permissions, chmod/chown, grep/sed/awk, process signals, systemctl, and cron jobs.",
              youtubeUrl: "https://www.youtube.com/watch?v=ZtqBQ68cfJc",
              position: 1
            },
            {
              title: "Automated Bash & Shell Scripting",
              description: "Shell variables, loops, conditional logic, error trapping, and deployment automation scripts.",
              youtubeUrl: "https://www.youtube.com/watch?v=v-FnUwcQvzM",
              position: 2
            }
          ]
        },
        {
          title: "Containerization & Docker",
          description: "Build Docker images, multi-stage builds, Docker Compose, networking, and volumes.",
          position: 2,
          topics: [
            {
              title: "Dockerfiles, Images & Multi-Stage Builds",
              description: "Container isolation, layer caching optimization, minimal Alpine base images, and security practices.",
              youtubeUrl: "https://www.youtube.com/watch?v=3c-iBn73dDE",
              position: 1
            },
            {
              title: "Multi-Container Applications with Docker Compose",
              description: "Service orchestration, environment variables, network bridges, volume persistence, and healthchecks.",
              youtubeUrl: "https://www.youtube.com/watch?v=HG6yLv1cKk0",
              position: 2
            }
          ]
        },
        {
          title: "Cloud Infrastructure (AWS) & Infrastructure as Code",
          description: "EC2, S3, VPC networking, IAM security policies, Terraform modules, and state management.",
          position: 3,
          topics: [
            {
              title: "AWS Core: VPC, EC2, S3 & IAM Security",
              description: "Subnets, security groups, EC2 instances, S3 bucket policies, and IAM role access management.",
              youtubeUrl: "https://www.youtube.com/watch?v=ulprqHHWlng",
              position: 1
            },
            {
              title: "Terraform Infrastructure Provisioning",
              description: "HCL syntax, provider setup, resource declaration, variables, outputs, and remote state locks.",
              youtubeUrl: "https://www.youtube.com/watch?v=7xngnjfIlK4",
              position: 2
            }
          ]
        },
        {
          title: "Kubernetes Orchestration & CI/CD Pipelines",
          description: "K8s Pods, Deployments, Services, Ingress Controllers, GitHub Actions, and GitOps.",
          position: 4,
          topics: [
            {
              title: "Kubernetes Clusters, Deployments & Service Mesh",
              description: "Pods, ReplicaSets, Rolling Updates, NodePorts, ClusterIP, Ingress NGINX, and Helm charts.",
              youtubeUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
              position: 1
            }
          ]
        }
      ]
    },
    {
      title: "Cybersecurity Analyst",
      description: "Inspect buffer overflows, enforce authentication encryption, audit security layers, and defend networks.",
      stages: [
        {
          title: "Networking & Security Fundamentals",
          description: "TCP/IP protocol stack, DNS resolution, Wireshark packet capture, and OSI model layers.",
          position: 1,
          topics: [
            {
              title: "TCP/IP, UDP, Subnetting & Packet Analysis",
              description: "IP addressing, CIDR notation, Wireshark packet analysis, TCP 3-way handshake, and port scanning.",
              youtubeUrl: "https://www.youtube.com/watch?v=qiQR5rTSshw",
              position: 1
            },
            {
              title: "Cryptography & PKI Infrastructure",
              description: "Symmetric vs Asymmetric encryption, AES, RSA, SHA-256 hashing, SSL/TLS handshakes, and digital certificates.",
              youtubeUrl: "https://www.youtube.com/watch?v=NmM9HA2MQGI",
              position: 2
            }
          ]
        },
        {
          title: "Web Security & OWASP Top 10",
          description: "Audit vulnerabilities: SQL Injection, XSS, CSRF, Broken Auth, and SSRF attacks.",
          position: 2,
          topics: [
            {
              title: "SQL Injection & Cross-Site Scripting (XSS)",
              description: "Reflected/Stored XSS, sanitized inputs, parameterized queries, Content Security Policy (CSP), and Burp Suite.",
              youtubeUrl: "https://www.youtube.com/watch?v=2OPc08BndjM",
              position: 1
            },
            {
              title: "Cross-Site Request Forgery (CSRF) & Auth Bypasses",
              description: "SameSite cookie policies, anti-CSRF tokens, JWT tampering, and broken object level authorization.",
              youtubeUrl: "https://www.youtube.com/watch?v=eWEgUcHPle0",
              position: 2
            }
          ]
        },
        {
          title: "System Penetration Testing & Defense",
          description: "Metasploit, Nmap reconnaissance, privilege escalation, Linux security, and log auditing.",
          position: 3,
          topics: [
            {
              title: "Nmap Network Scanning & Vulnerability Assessment",
              description: "SYN stealth scans, OS detection, NSE scripts, service banner grabbing, and risk scoring.",
              youtubeUrl: "https://www.youtube.com/watch?v=4t4kBkMsDbY",
              position: 1
            }
          ]
        },
        {
          title: "SOC Operations & Incident Response",
          description: "SIEM log monitoring, malware analysis, forensic analysis, and threat hunting.",
          position: 4,
          topics: [
            {
              title: "SIEM Monitoring & Security Log Analysis",
              description: "Splunk/Elastic SIEM rules, log parsing, threat intelligence feeds, and incident mitigation workflows.",
              youtubeUrl: "https://www.youtube.com/watch?v=Q8lS08x-mEE",
              position: 1
            }
          ]
        }
      ]
    },
    {
      title: "Data Scientist",
      description: "Analyze complex datasets, build statistical models, perform exploratory data analysis, and derive actionable business insights.",
      stages: [
        {
          title: "Python Data Science Stack & SQL",
          description: "Master NumPy, Pandas, SQL queries, relational joins, data aggregation, and data hygiene.",
          position: 1,
          topics: [
            {
              title: "Python Data Analysis with NumPy & Pandas",
              description: "Dataframe manipulation, index alignment, vector operations, missing value handling, and grouping.",
              youtubeUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
              position: 1,
              quizJson: JSON.stringify([
                {
                  question: "Which Pandas method aggregates data by one or more column values?",
                  options: ["pivot()", "groupby()", "aggregate()", "filter()"],
                  answerIndex: 1
                }
              ])
            },
            {
              title: "SQL Window Functions, Joins & Aggregations",
              description: "Complex SQL queries, INNER/LEFT joins, CTEs, ROW_NUMBER(), and analytical aggregations.",
              youtubeUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
              position: 2
            }
          ]
        },
        {
          title: "Exploratory Data Analysis & Statistics",
          description: "Descriptive statistics, probability distributions, hypothesis testing, and visualization with Matplotlib & Seaborn.",
          position: 2,
          topics: [
            {
              title: "Statistical Inference, Probability & A/B Testing",
              description: "Central Limit Theorem, p-values, z-tests, t-tests, confidence intervals, and experimental design.",
              youtubeUrl: "https://www.youtube.com/watch?v=0D2Fflw068A",
              position: 1
            },
            {
              title: "Data Visualization with Matplotlib & Seaborn",
              description: "Distribution plots, heatmaps, box plots, scatter matrices, and storytelling with data.",
              youtubeUrl: "https://www.youtube.com/watch?v=UO98lJQ3QGI",
              position: 2
            }
          ]
        },
        {
          title: "Machine Learning & Predictive Modeling",
          description: "Supervised and unsupervised learning, feature engineering, and model validation using Scikit-Learn.",
          position: 3,
          topics: [
            {
              title: "Regression, Classification & Ensemble Methods",
              description: "Logistic Regression, Random Forests, XGBoost, feature importance, and hyperparameter tuning.",
              youtubeUrl: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
              position: 1
            }
          ]
        },
        {
          title: "Big Data & Production Data Pipelines",
          description: "PySpark distributed data processing, time-series forecasting, and data pipeline orchestration.",
          position: 4,
          topics: [
            {
              title: "PySpark Distributed Computing & Feature Engineering",
              description: "Spark DataFrames, Resilient Distributed Datasets (RDDs), distributed joins, and MLlib.",
              youtubeUrl: "https://www.youtube.com/watch?v=_C8kWso474U",
              position: 1
            }
          ]
        }
      ]
    }
  ];

  for (const spec of specializationsData) {
    const careerPath = await prisma.careerPath.upsert({
      where: { id: `cp-${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}` },
      update: {
        title: spec.title,
        description: spec.description,
        skills: "Data Structures, Algorithms, Problem Solving, Software Architecture",
        languages: "C++, TypeScript, Python, SQL, Java",
        technologies: "Next.js, PostgreSQL, Docker, AWS, PyTorch",
        placementRelevance: "High Industry Demand for Tier-1 Product Companies & Tech Giants"
      },
      create: {
        id: `cp-${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        title: spec.title,
        description: spec.description,
        skills: "Data Structures, Algorithms, Problem Solving, Software Architecture",
        languages: "C++, TypeScript, Python, SQL, Java",
        technologies: "Next.js, PostgreSQL, Docker, AWS, PyTorch",
        placementRelevance: "High Industry Demand for Tier-1 Product Companies & Tech Giants"
      }
    });

    const roadmap = await prisma.roadmap.upsert({
      where: { id: `rm-${careerPath.id}` },
      update: {
        title: `${spec.title} Engineering Path`,
        description: `Comprehensive 4-stage sequential learning pathway for ${spec.title}.`
      },
      create: {
        id: `rm-${careerPath.id}`,
        title: `${spec.title} Engineering Path`,
        description: `Comprehensive 4-stage sequential learning pathway for ${spec.title}.`,
        careerPathId: careerPath.id
      }
    });

    for (const stageData of spec.stages) {
      const stage = await prisma.roadmapStage.upsert({
        where: { id: `stg-${roadmap.id}-${stageData.position}` },
        update: {
          title: stageData.title,
          description: stageData.description,
          position: stageData.position
        },
        create: {
          id: `stg-${roadmap.id}-${stageData.position}`,
          title: stageData.title,
          description: stageData.description,
          position: stageData.position,
          roadmapId: roadmap.id
        }
      });

      for (const topicData of stageData.topics) {
        await prisma.stageTopic.upsert({
          where: { id: `tpc-${stage.id}-${topicData.position}` },
          update: {
            title: topicData.title,
            description: topicData.description,
            youtubeUrl: topicData.youtubeUrl,
            quizJson: topicData.quizJson || null,
            position: topicData.position
          },
          create: {
            id: `tpc-${stage.id}-${topicData.position}`,
            title: topicData.title,
            description: topicData.description,
            youtubeUrl: topicData.youtubeUrl,
            quizJson: topicData.quizJson || null,
            position: topicData.position,
            stageId: stage.id
          }
        });
      }
    }

    console.log(`Specialization seeded: ${spec.title}`);
  }

  // =========================================================
  // 7. SEED DSA FOUNDATION PROBLEMS (EASY, MEDIUM, HARD, EXPERT)
  // =========================================================

  const dsaProblemsData = [
    {
      id: "dsa-1",
      title: "Two Sum",
      difficulty: "EASY",
      tags: "Arrays, Hash Table",
      companyRelevance: "Google, Amazon, Meta, Microsoft",
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examplesJson: JSON.stringify([
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
      ]),
      constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
      solutionCode: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      solutionExplanation: "We iterate through the array once while storing each element's value and index in a Hash Map. For each element, we check if `target - nums[i]` exists in the map. This gives O(N) time complexity and O(N) space complexity.",
      hints: [
        "A brute force approach checks every pair using nested loops in O(N^2) time. Can we use a data structure to look up complement values faster?",
        "Store visited numbers in a Hash Map with their indices. When processing element x, look for (target - x) in the Hash Map."
      ]
    },
    {
      id: "dsa-2",
      title: "Valid Parentheses",
      difficulty: "EASY",
      tags: "String, Stack",
      companyRelevance: "Amazon, Meta, Bloomberg",
      description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
      examplesJson: JSON.stringify([
        {
          input: "s = '()[]{}'",
          output: "true",
          explanation: "All brackets open and close properly."
        },
        {
          input: "s = '(]'",
          output: "false",
          explanation: "Bracket types mismatch."
        }
      ]),
      constraints: "1 <= s.length <= 10^4\ns consists of brackets only '()[]{}'.",
      solutionCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      solutionExplanation: "Use a Stack to push opening brackets. When encountering a closing bracket, pop the top of the stack and check if it matches the expected opening bracket. If stack is empty at the end, the string is valid. Time O(N), Space O(N).",
      hints: [
        "Think of Last-In-First-Out (LIFO) property. The last opened bracket must be closed first.",
        "Use a stack. Push opening brackets '(', '{', '['. When seeing a closing bracket, check if it matches stack.pop()."
      ]
    },
    {
      id: "dsa-3",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "MEDIUM",
      tags: "Hash Table, String, Sliding Window",
      companyRelevance: "Google, Meta, Amazon, Apple",
      description: "Given a string `s`, find the length of the longest substring without repeating characters.",
      examplesJson: JSON.stringify([
        {
          input: "s = 'abcabcbb'",
          output: "3",
          explanation: "The answer is 'abc', with the length of 3."
        },
        {
          input: "s = 'bbbbb'",
          output: "1",
          explanation: "The answer is 'b', with the length of 1."
        }
      ]),
      constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
      solutionCode: `function lengthOfLongestSubstring(s: string): number {
  const charMap = new Map<string, number>();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char)! >= left) {
      left = charMap.get(char)! + 1;
    }
    charMap.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      solutionExplanation: "Maintain a sliding window `[left, right]`. As `right` moves forward, if character `s[right]` was seen inside the current window, shrink the window by moving `left` to `previousIndex + 1`. Track maximum window size. Time O(N), Space O(K).",
      hints: [
        "Use the Sliding Window technique with two pointers `left` and `right`.",
        "Store character last seen positions in a map to jump `left` pointer instantly when a repeat occurs."
      ]
    },
    {
      id: "dsa-4",
      title: "Container With Most Water",
      difficulty: "MEDIUM",
      tags: "Array, Two Pointers, Greedy",
      companyRelevance: "Google, Meta, Adobe",
      description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
      examplesJson: JSON.stringify([
        {
          input: "height = [1,8,6,2,5,4,8,3,7]",
          output: "49",
          explanation: "The vertical lines are at indices with heights [8, 7]. The area is min(8, 7) * (8 - 1) = 49."
        }
      ]),
      constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
      solutionCode: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const currentWater = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, currentWater);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
      solutionExplanation: "Place two pointers at the ends of the array. The area is limited by the shorter height. Move the pointer pointing to the shorter line inwards to attempt finding a taller line. Time O(N), Space O(1).",
      hints: [
        "Start with pointers at extreme ends (0 and n-1). The width is maximized at the start.",
        "To potentially increase area while width decreases, you MUST increase height. So move whichever pointer has the shorter height."
      ]
    },
    {
      id: "dsa-5",
      title: "Trapping Rain Water",
      difficulty: "HARD",
      tags: "Array, Two Pointers, Dynamic Programming, Stack",
      companyRelevance: "Google, Amazon, Meta, Goldman Sachs",
      description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examplesJson: JSON.stringify([
        {
          input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
          output: "6",
          explanation: "6 units of rain water are trapped in the elevation hollows."
        }
      ]),
      constraints: "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
      solutionCode: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      solutionExplanation: "Water trapped at any index `i` is `min(maxLeft, maxRight) - height[i]`. Using two pointers moving inwards while updating `leftMax` and `rightMax`, we compute total trapped water in O(N) time and O(1) space.",
      hints: [
        "Water level above bar i depends on the maximum height to its left AND maximum height to its right.",
        "Use two pointers. Maintain `leftMax` and `rightMax`. If `height[left] < height[right]`, we know `leftMax` governs water height for `left`."
      ]
    },
    {
      id: "dsa-6",
      title: "Merge k Sorted Lists",
      difficulty: "HARD",
      tags: "Linked List, Heap, Divide and Conquer",
      companyRelevance: "Meta, Amazon, Microsoft, Uber",
      description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      examplesJson: JSON.stringify([
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]",
          explanation: "The linked-lists are merged into one sorted list."
        }
      ]),
      constraints: "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4",
      solutionCode: `// Priority Queue or Divide & Conquer approach
function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;
  while (lists.length > 1) {
    const merged: (ListNode | null)[] = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(merge2Lists(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}`,
      solutionExplanation: "Merge pairs of lists iteratively (Divide & Conquer) just like Merge Sort. Time complexity is O(N log k), where N is total nodes and k is number of lists. Space complexity O(1) or O(log k).",
      hints: [
        "Merging 2 sorted lists takes O(N) time. If you merge k lists 2 by 2 pairwise (divide & conquer), how many rounds does it take?",
        "Alternatively, use a Min-Heap (Priority Queue) containing the head of each non-empty list."
      ]
    },
    {
      id: "dsa-7",
      title: "N-Queens II",
      difficulty: "EXPERT",
      tags: "Backtracking",
      companyRelevance: "Google, Meta, Apple",
      description: "The `n`-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Given an integer `n`, return the number of distinct solutions to the `n`-queens puzzle.",
      examplesJson: JSON.stringify([
        {
          input: "n = 4",
          output: "2",
          explanation: "There are two distinct solutions to the 4-queens puzzle."
        }
      ]),
      constraints: "1 <= n <= 9",
      solutionCode: `function totalNQueens(n: number): number {
  let count = 0;
  const cols = new Set<number>();
  const posDiag = new Set<number>(); // row + col
  const negDiag = new Set<number>(); // row - col

  function backtrack(row: number) {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || posDiag.has(row + col) || negDiag.has(row - col)) continue;
      cols.add(col);
      posDiag.add(row + col);
      negDiag.add(row - col);
      backtrack(row + 1);
      cols.delete(col);
      posDiag.delete(row + col);
      negDiag.delete(row - col);
    }
  }

  backtrack(0);
  return count;
}`,
      solutionExplanation: "Backtracking row by row. Maintain Hash Sets for active columns, positive diagonals `(r + c)`, and negative diagonals `(r - c)`. Place a queen if safe, recurse to next row, then backtrack. Time O(N!), Space O(N).",
      hints: [
        "Place queens row by row from row 0 to n-1.",
        "Track attacked columns and diagonals using sets: `row + col` identifies positive diagonal, `row - col` identifies negative diagonal."
      ]
    },
    {
      id: "dsa-8",
      title: "Median of Two Sorted Arrays",
      difficulty: "EXPERT",
      tags: "Array, Binary Search, Divide and Conquer",
      companyRelevance: "Google, Meta, Amazon, Apple, Microsoft",
      description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
      examplesJson: JSON.stringify([
        {
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000",
          explanation: "merged array = [1,2,3] and median is 2."
        },
        {
          input: "nums1 = [1,2], nums2 = [3,4]",
          output: "2.50000",
          explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
        }
      ]),
      constraints: "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000",
      solutionCode: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let low = 0, high = m;
  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];

    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
      } else {
        return Math.max(maxLeft1, maxLeft2);
      }
    } else if (maxLeft1 > minRight2) {
      high = i - 1;
    } else {
      low = i + 1;
    }
  }
  return 0;
}`,
      solutionExplanation: "Binary search on the smaller array `nums1` to find a partition where `maxLeft1 <= minRight2` and `maxLeft2 <= minRight1`. This guarantees half the total elements are on the left. Time O(log(min(m, n))), Space O(1).",
      hints: [
        "Merging arrays takes O(m+n) time. To get O(log(m+n)), binary search must be used.",
        "Binary search the partition index of the smaller array so that left partition elements are <= right partition elements."
      ]
    }
  ];

  for (const prob of dsaProblemsData) {
    const problem = await prisma.dsaProblem.upsert({
      where: { id: prob.id },
      update: {
        title: prob.title,
        difficulty: prob.difficulty,
        tags: prob.tags,
        companyRelevance: prob.companyRelevance,
        description: prob.description,
        examplesJson: prob.examplesJson,
        constraints: prob.constraints,
        solutionCode: prob.solutionCode,
        solutionExplanation: prob.solutionExplanation
      },
      create: {
        id: prob.id,
        title: prob.title,
        difficulty: prob.difficulty,
        tags: prob.tags,
        companyRelevance: prob.companyRelevance,
        description: prob.description,
        examplesJson: prob.examplesJson,
        constraints: prob.constraints,
        solutionCode: prob.solutionCode,
        solutionExplanation: prob.solutionExplanation
      }
    });

    for (let hIdx = 0; hIdx < prob.hints.length; hIdx++) {
      await prisma.dsaHint.upsert({
        where: { id: `hint-${prob.id}-${hIdx + 1}` },
        update: {
          content: prob.hints[hIdx],
          position: hIdx + 1
        },
        create: {
          id: `hint-${prob.id}-${hIdx + 1}`,
          problemId: problem.id,
          content: prob.hints[hIdx],
          position: hIdx + 1
        }
      });
    }

    console.log(`DSA Problem seeded: [${prob.difficulty}] ${prob.title}`);
  }

  // =========================================================
  // FINISHED
  // =========================================================

  console.log("--------------------------------------");
  console.log("Specializations, Roadmaps & DSA seeded successfully.");
  console.log("--------------------------------------");
  console.log("Seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });