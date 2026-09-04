import React from "react";
import {
  ArrowRight,
  Code,
  Terminal,
  Database,
  Shield,
  Layers,
  Cpu,
  Bookmark,
  CheckSquare,
  FileCheck,
  Award,
  ChevronRight,
} from "lucide-react";
import InteractiveJourney from "@/components/ui/InteractiveJourney";

export default function Home() {
  const careerPaths = [
    {
      title: "Software Engineer",
      description: "Focus on memory management, fundamental algorithms, complex data structures, and computer science systems.",
      tools: ["C++", "Java", "DSA", "System Design"],
      icon: Cpu,
    },
    {
      title: "Full-Stack Developer",
      description: "Build scalable web architectures, transactional databases, client-side hydration, and dynamic components.",
      tools: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind"],
      icon: Layers,
    },
    {
      title: "AI/ML Engineer",
      description: "Develop deep neural networks, process raw tensors, refine weights, and manage data training pipelines.",
      tools: ["Python", "PyTorch", "NumPy", "Scikit-Learn"],
      icon: Code,
    },
    {
      title: "DevOps & Cloud",
      description: "Automate container orchestration, manage continuous delivery pipelines, and architect high-availability servers.",
      tools: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
      icon: Database,
    },
    {
      title: "Cybersecurity Analyst",
      description: "Inspect buffer overflows, enforce authentication encryption, audit security layers, and defend networks.",
      tools: ["Linux", "Wireshark", "Cryptography", "Python"],
      icon: Shield,
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1: HERO */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 border-b border-border-sharp overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.05),transparent_40%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-sharp px-3 py-1.5 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-mono text-[10px] text-text-dim tracking-wider uppercase">
              SkillForge v1.0 Foundation
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-main leading-[1.05] max-w-5xl mx-auto uppercase">
              Build Your <span className="text-primary">Future</span>.
            </h1>
            <p className="font-display text-lg sm:text-2xl font-medium text-text-dim tracking-wide max-w-3xl mx-auto">
              Learn. Build. Practice. Get Hired.
            </p>
          </div>

          <p className="font-sans text-sm sm:text-base text-text-sub max-w-2xl mx-auto leading-relaxed">
            A highly structured, rigorous tech career-development platform. From writing your first clean compile to deploying portfolio projects and undergoing technical interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#paths"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dim text-bg-base font-sans text-sm font-bold tracking-wide uppercase px-8 py-3.5 rounded-sm transition-colors duration-150 gap-2"
            >
              Explore Career Paths
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#journey"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-border-sharp hover:bg-bg-surface text-text-main font-sans text-sm font-semibold tracking-wide uppercase px-8 py-3.5 rounded-sm transition-colors duration-150"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION */}
      <section className="py-24 bg-bg-surface border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-main uppercase">
                Bridging the Gap to Production Competency
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="font-sans text-sm sm:text-base text-text-dim leading-relaxed">
                Traditional platforms offer fragmented video clips and copy-paste tutorials. SkillForge by Code404 provides an integrated workspace where learning paths are linked to actual compiler sandboxes, real projects require local git submissions, and certificates are cryptographically verified. We replace the generic SaaS dashboard with a professional technical environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CAREER PATH DISCOVERY */}
      <section id="paths" className="py-24 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
              DISCOVER
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main uppercase">
              Choose Your Specialization
            </h2>
            <p className="font-sans text-sm text-text-dim max-w-xl mx-auto">
              Select a specialized engineering track. We provide a structured roadmap tailored specifically to teach you these skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => {
              const PathIcon = path.icon;
              return (
                <div
                  key={path.title}
                  className="bg-bg-surface border border-border-sharp p-6 rounded-sm flex flex-col justify-between space-y-6 hover:border-text-sub transition-colors duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center h-10 w-10 bg-bg-base border border-border-sharp rounded-sm">
                        <PathIcon className="h-5 w-5 text-primary" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-sub" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold text-text-main">{path.title}</h3>
                      <p className="font-sans text-xs text-text-dim leading-relaxed">{path.description}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border-sharp/40 flex flex-wrap gap-1.5">
                    {path.tools.map((tool) => (
                      <span
                        key={tool}
                        className="font-mono text-[9px] text-text-sub bg-bg-base px-2 py-0.5 border border-border-sharp rounded-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE JOURNEY */}
      <section id="journey" className="py-24 bg-bg-surface/50 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
              THE PIPELINE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main uppercase">
              The SkillForge Roadmap Lifecycle
            </h2>
            <p className="font-sans text-sm text-text-dim max-w-xl mx-auto">
              We guide you sequentially through six distinct milestones of engineering skill acquisition.
            </p>
          </div>

          <InteractiveJourney />
        </div>
      </section>

      {/* SECTION 5: COURSES & LMS TEASER */}
      <section id="courses" className="py-24 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-bg-surface border border-border-sharp px-3 py-1 rounded-sm">
                <Bookmark className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
                  LEARN
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-text-main uppercase leading-tight">
                Curriculum built for engineering precision.
              </h2>
              <p className="font-sans text-sm text-text-dim leading-relaxed">
                Read deep-dives on compiler stages, browser thread concurrency, indexes, database sharding, and memory allocation. Our learning engine prioritizes text-heavy, technical documentation layout for deep focus.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="font-mono text-[10px] text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">No Fluff Syllabus</h4>
                    <p className="text-xs text-text-dim">Content focused strictly on execution concepts and compiler behavior.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="font-mono text-[10px] text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Rich Documentation Layout</h4>
                    <p className="text-xs text-text-dim">High-contrast font scaling, code syntax highlighted cards, and charts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Module Card Visual */}
            <div className="lg:col-span-7 bg-bg-surface border border-border-sharp p-6 sm:p-8 rounded-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-sharp/40 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider">ACTIVE COURSE</span>
                    <h3 className="font-display text-lg font-bold text-text-main mt-1">Systems Programming with C++</h3>
                  </div>
                  <span className="text-xs font-mono text-primary">Module 3/8</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-bg-base/60 border border-border-sharp rounded-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-text-sub">3.1</span>
                      <span className="text-xs text-text-main font-semibold">Memory Allocations & The Heap</span>
                    </div>
                    <span className="text-[10px] font-mono text-success">Completed</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-bg-base border border-primary/20 rounded-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-primary font-bold">3.2</span>
                      <span className="text-xs text-text-main font-semibold">Pointers, References, and Address Arithmetic</span>
                    </div>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-sm">Reading</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-bg-base/40 border border-border-sharp/50 rounded-sm opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-text-sub">3.3</span>
                      <span className="text-xs text-text-dim">Smart Pointers: unique_ptr & shared_ptr</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-sub">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRACTICE SANDBOX TEASER */}
      <section id="practice" className="py-24 bg-bg-surface/30 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Editor Mock */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-bg-surface border border-border-sharp p-4 rounded-sm font-mono text-xs shadow-lg">
              <div className="flex items-center justify-between border-b border-border-sharp/60 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-border-sharp"></span>
                  <span className="text-xs text-text-dim">binary_search.py</span>
                </div>
                <span className="text-[10px] font-bold text-success animate-pulse">Ready</span>
              </div>
              <div className="space-y-1.5 text-text-dim bg-bg-base/90 p-4 rounded-sm leading-relaxed overflow-x-auto">
                <div><span className="text-primary-dim">def</span> <span className="text-text-main font-semibold">binarySearch</span>(arr, target):</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;left, right = <span className="text-primary-dim">0</span>, len(arr) - <span className="text-primary-dim">1</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">while</span> left &lt;= right:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mid = (left + right) // <span className="text-primary-dim">2</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">if</span> arr[mid] == target:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">return</span> mid</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">elif</span> arr[mid] &lt; target:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left = mid + <span className="text-primary-dim">1</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">else</span>:</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;right = mid - <span className="text-primary-dim">1</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">return</span> -<span className="text-primary-dim">1</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border-sharp/40 pt-3">
                <span className="text-[10px] text-text-sub">Test case 1/3: [1, 3, 5, 7, 9], target=5</span>
                <button className="bg-success text-bg-base font-semibold px-4 py-1.5 rounded-sm hover:bg-success/90 transition-colors text-[11px] font-sans">
                  Run Tests
                </button>
              </div>
            </div>

            {/* Info Text */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-bg-surface border border-border-sharp px-3 py-1 rounded-sm">
                <Terminal className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
                  PRACTICE
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-text-main uppercase leading-tight">
                Solve coding puzzles. Inspect execution time.
              </h2>
              <p className="font-sans text-sm text-text-dim leading-relaxed">
                Test your skills in our embedded code playground. Beyond solving logic questions, you will examine Big-O complexity, test corner cases, and optimize memory footprints under compilation restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PROJECT HUB */}
      <section id="projects" className="py-24 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-bg-surface border border-border-sharp px-3 py-1 rounded-sm">
                <CheckSquare className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
                  BUILD
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-text-main uppercase leading-tight">
                Guide-driven production projects.
              </h2>
              <p className="font-sans text-sm text-text-dim leading-relaxed">
                Build applications that demonstrate real engineering merit. Follow a sequential step-by-step checklist of construction tasks. Submit repository links for verification against system integration checks.
              </p>
            </div>

            {/* Project tasks mockup list */}
            <div className="lg:col-span-7 bg-bg-surface border border-border-sharp p-6 sm:p-8 rounded-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-sharp/40 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider">PROJECT TEMPLATE</span>
                    <h3 className="font-display text-lg font-bold text-text-main mt-1">Distributed key-value store (Go)</h3>
                  </div>
                  <span className="text-xs font-mono text-primary-dim">Hard difficulty</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked readOnly className="mt-1 accent-primary" />
                    <div>
                      <h4 className="text-xs font-bold text-text-main line-through">Task 1: TCP Server Bind & Keep-Alive Settings</h4>
                      <p className="text-xs text-text-dim leading-relaxed">Configure the TCP socket listener on port 6379, ensuring connections do not time out under load.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked readOnly className="mt-1 accent-primary" />
                    <div>
                      <h4 className="text-xs font-bold text-text-main line-through">Task 2: RESP Protocol Parsing Engine</h4>
                      <p className="text-xs text-text-dim leading-relaxed">Implement parsing logic for Redis Serialization Protocol commands (GET, SET, DEL).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked={false} readOnly className="mt-1 accent-primary" />
                    <div>
                      <h4 className="text-xs font-bold text-text-main">Task 3: Append-Only Logging (AOF) Persistence</h4>
                      <p className="text-xs text-text-dim leading-relaxed">Write commands synchronously to an append-only log file on disk to guarantee durability.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: PLACEMENT PREPARATION */}
      <section id="placement" className="py-24 bg-bg-surface/20 border-b border-border-sharp">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* QA Bank Mock */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-bg-surface border border-border-sharp p-6 rounded-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-sharp/40 pb-3">
                  <span className="text-xs font-mono text-text-sub uppercase tracking-wider">Placement Prep Bank</span>
                  <span className="text-[10px] text-text-sub font-mono">1,200+ Questions</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-bg-base border border-border-sharp rounded-sm flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-main">Explain Consistent Hashing and ring architectures</h4>
                      <p className="text-[10px] text-text-sub font-mono mt-1">SYSTEM DESIGN • MEDIUM</p>
                    </div>
                    <span className="text-[10px] text-text-dim bg-bg-surface px-2.5 py-1 border border-border-sharp rounded-sm">View Solution</span>
                  </div>

                  <div className="p-3 bg-bg-base border border-border-sharp rounded-sm flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-main">Reverse a Singly Linked List in place</h4>
                      <p className="text-[10px] text-text-sub font-mono mt-1">DATA STRUCTURES • EASY</p>
                    </div>
                    <span className="text-[10px] text-text-dim bg-bg-surface px-2.5 py-1 border border-border-sharp rounded-sm">View Solution</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Text */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-bg-surface border border-border-sharp px-3 py-1 rounded-sm">
                <FileCheck className="h-3 w-3 text-primary" />
                <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
                  PREPARE
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-text-main uppercase leading-tight">
                Practice interview pools. Build clean resumes.
              </h2>
              <p className="font-sans text-sm text-text-dim leading-relaxed">
                Review technical questions asked in top tier engineering placements. Utilize our profile resume builder to compile ATS-optimized resumes highlighting your verified projects and course achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: CODE404 IDENTITY */}
      <section className="py-24 border-b border-border-sharp relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.02),transparent_30%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
            ENGINEERING STAMP
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-text-main uppercase">
            Powered by CODE404
          </h2>
          <p className="font-sans text-sm text-text-dim max-w-2xl mx-auto leading-relaxed">
            SkillForge is engineered and maintained by Code404. We are a developer-first engineering team. We don&apos;t believe in generic learning templates, artificial intelligence wrappers, or gamified tokens. We believe in reading documentation, compiling code, testing features, and getting hired.
          </p>
        </div>
      </section>

      {/* SECTION 10: FINAL CALL-TO-ACTION */}
      <section className="py-28 bg-bg-surface border-b border-border-sharp">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Award className="h-10 w-10 text-primary mx-auto" />
          <div className="space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-text-main uppercase">
              CRAFT YOUR DESTINY.
            </h2>
            <p className="font-display text-sm sm:text-base font-semibold text-primary uppercase tracking-widest">
              Stop procrastinating. Start building.
            </p>
          </div>
          <p className="font-sans text-sm text-text-dim max-w-xl mx-auto leading-relaxed">
            Enroll in a Career Path today. Get access to verified roadmaps, sandbox compilers, step-by-step projects, and placement prep.
          </p>
          <div className="pt-4">
            <a
              href="#paths"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dim text-bg-base font-sans text-sm font-bold tracking-wide uppercase px-8 py-3.5 rounded-sm transition-colors duration-150 gap-2 focus:outline-none"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
