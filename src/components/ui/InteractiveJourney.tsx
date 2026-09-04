"use client";

import React, { useState } from "react";
import { Compass, BookOpen, Terminal, Hammer, FileText, CheckCircle2 } from "lucide-react";

interface Stage {
  id: string;
  num: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  features: string[];
  mockType: "discover" | "learn" | "practice" | "build" | "prepare" | "hired";
}

export default function InteractiveJourney() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages: Stage[] = [
    {
      id: "discover",
      num: "01",
      name: "DISCOVER",
      icon: Compass,
      tagline: "Uncover Your Ideal Tech Path",
      description: "Answer a series of interest-alignment questions and foundational aptitude checks. SkillForge evaluates your strengths and matches you with high-paying career tracks tailored to your logical profile.",
      features: [
        "Career Path Explorer (Software Engineer, ML, Cloud)",
        "Interest-Alignment Assessments",
        "Role-specific Competency Checklists",
        "Industry Market Demand & Salary Insights"
      ],
      mockType: "discover"
    },
    {
      id: "learn",
      num: "02",
      name: "LEARN",
      icon: BookOpen,
      tagline: "Structured Modular Curriculum",
      description: "Step-by-step learning modules with rich text, high-definition videos, and code examples. Skip the tutorial hell and follow a verified sequence of expert-curated modules that move you from theory to solid coding.",
      features: [
        "Zero-clutter, content-focused reading layouts",
        "Concept-level coding references and examples",
        "Offline resource bundles & cheatsheets",
        "Regular module milestones and achievements"
      ],
      mockType: "learn"
    },
    {
      id: "practice",
      num: "03",
      name: "PRACTICE",
      icon: Terminal,
      tagline: "In-Browser Sandbox Practice",
      description: "Write code directly in our secure web compiler. Solve logical algorithm challenges, verify your output against real-time unit tests, and review execution times to optimize your code's performance.",
      features: [
        "Interactive Coding Playground",
        "Auto-grading Unit Test Suites",
        "Logical & Quantitative Aptitude Quizzes",
        "Immediate detailed execution feedback"
      ],
      mockType: "practice"
    },
    {
      id: "build",
      num: "04",
      name: "BUILD",
      icon: Hammer,
      tagline: "Forge Portfolio-Grade Projects",
      description: "Work on multi-tier production projects (e.g. distributed message brokers, secure commerce APIs). Build task-by-task with our detailed checklists, submit your GitHub repositories, and undergo peer validation.",
      features: [
        "Step-by-step guided task checksheets",
        "Starter repositories with CI configurations",
        "Automated integration tests checking code quality",
        "Code review checklist templates"
      ],
      mockType: "build"
    },
    {
      id: "prepare",
      num: "05",
      name: "PREPARE",
      icon: FileText,
      tagline: "Polished Career Readiness",
      description: "Prepare for hard technical interviews. Search through our indexed bank of real interview questions, practice simulated mock interviews, and compile an ATS-optimized, developer-branded resume.",
      features: [
        "Stripe, Meta, and Google Interview QA Banks",
        "ATS-optimized Markdown Resume Builder",
        "Detailed behavioral interview guidelines",
        "Interactive mock coding timer settings"
      ],
      mockType: "prepare"
    },
    {
      id: "hired",
      num: "06",
      name: "GET HIRED",
      icon: CheckCircle2,
      tagline: "Verified Achievement Gateway",
      description: "Earn cryptographic SkillForge certificates. Share public, secure verification links containing your project repos, course assessments, and quantitative scores directly to recruiters and hiring managers.",
      features: [
        "Verifiable cryptographic certificate IDs",
        "Publicly hostable student portfolio verifications",
        "Direct connection to tech hiring partners",
        "Code404 signature of validation"
      ],
      mockType: "hired"
    }
  ];

  const currentStage = stages[activeStageIndex];
  const ActiveIcon = currentStage.icon;

  const renderMockup = (type: string) => {
    switch (type) {
      case "discover":
        return (
          <div className="flex flex-col space-y-4 p-5 font-sans">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-3">
              <span className="text-xs font-mono text-text-sub uppercase tracking-wider">Interest Matcher</span>
              <span className="text-xs font-semibold text-primary">87% Logical Fit</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-text-main">Suggested Path: Software Engineer</div>
              <p className="text-xs text-text-dim leading-relaxed">Based on your focus on logic structures, systems programming, and algorithmic puzzles, we recommend starting with C++ systems programming followed by Frontend architecture.</p>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-2 w-full bg-bg-base border border-border-sharp rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "87%" }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-text-sub font-mono">
                <span>System Logic: High</span>
                <span>Visual Layout: Medium</span>
              </div>
            </div>
          </div>
        );
      case "learn":
        return (
          <div className="flex flex-col space-y-3 p-5 font-sans">
            <div className="flex items-center space-x-2 border-b border-border-sharp/40 pb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono text-text-sub uppercase">Module 1.4: Git Internals</span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-text-main">The .git/objects Directory</div>
              <p className="text-[11px] text-text-dim leading-relaxed">
                Git stores all snapshots as compressed blob, tree, or commit objects inside `.git/objects/`. A file content is hashed to a SHA-1 code, creating its database key...
              </p>
            </div>
            <div className="bg-bg-base/70 p-3.5 border border-border-sharp/60 rounded-sm font-mono text-[10px] text-primary/90 leading-tight">
              $ git cat-file -t e69de29<br />
              &gt; blob
            </div>
          </div>
        );
      case "practice":
        return (
          <div className="flex flex-col space-y-2.5 p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-2">
              <span className="text-text-sub">two_sum.cpp</span>
              <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-sm">Passed</span>
            </div>
            <div className="bg-bg-base/80 p-3 rounded-sm text-text-dim leading-tight text-[11px]">
              <span className="text-primary-dim">vector&lt;int&gt;</span> twoSum(<span className="text-primary-dim">vector&lt;int&gt;</span>&amp; nums, <span className="text-primary-dim">int</span> target) &#123;<br />
              &nbsp;&nbsp;unordered_map&lt;int, int&gt; hash;<br />
              &nbsp;&nbsp;<span className="text-primary-dim">for</span> (<span className="text-primary-dim">int</span> i = 0; i &lt; nums.size(); ++i) &#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">int</span> diff = target - nums[i];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">if</span> (hash.count(diff))<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary-dim">return</span> &#123;hash[diff], i&#125;;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;hash[nums[i]] = i;<br />
              &nbsp;&nbsp;&#125;<br />
              &nbsp;&nbsp;<span className="text-primary-dim">return</span> &#123;&#125;;<br />
              &#125;
            </div>
            <div className="flex justify-between text-[10px] text-text-sub pt-1">
              <span>Tests: 4/4 passed</span>
              <span>Runtime: 8ms</span>
            </div>
          </div>
        );
      case "build":
        return (
          <div className="flex flex-col space-y-3 p-5 font-sans">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-2">
              <span className="text-xs font-mono text-text-sub uppercase">Project: Message Broker</span>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-sm">In Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <input type="checkbox" checked readOnly className="mt-1 accent-primary" />
                <span className="text-xs text-text-dim line-through">Task 1: Establish TCP socket servers on Port 8000</span>
              </div>
              <div className="flex items-start gap-2.5">
                <input type="checkbox" checked readOnly className="mt-1 accent-primary" />
                <span className="text-xs text-text-dim line-through">Task 2: Implement protocol serialization library</span>
              </div>
              <div className="flex items-start gap-2.5">
                <input type="checkbox" defaultChecked={false} readOnly className="mt-1 accent-primary" />
                <span className="text-xs text-text-main font-medium">Task 3: Write subscription topics map in memory</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border-sharp/20 text-[10px] text-text-sub font-mono">
              GitHub repository linked: code404/redis-lite-broker
            </div>
          </div>
        );
      case "prepare":
        return (
          <div className="flex flex-col space-y-3 p-5 font-sans">
            <div className="flex items-center justify-between border-b border-border-sharp/40 pb-2">
              <span className="text-xs font-mono text-text-sub">Resume Builder</span>
              <span className="text-[10px] text-text-sub">ATS Rank: 94</span>
            </div>
            <div className="space-y-2">
              <div className="text-center font-display text-sm font-semibold text-text-main tracking-tight">Karan Sharma</div>
              <div className="text-center text-[10px] text-text-sub font-mono -mt-1">karan@code404.dev • github.com/karan404</div>
              <div className="pt-1.5 border-t border-border-sharp/40 space-y-1">
                <div className="text-[9px] font-bold text-text-main uppercase tracking-wider">Verified Projects</div>
                <div className="text-[10px] font-medium text-text-dim">RedisLite Broker (C++) — Verified score 98%</div>
                <div className="text-[9px] text-text-sub leading-tight">Built socket structures, managed connection pool buffers, passing benchmark stress tests.</div>
              </div>
            </div>
          </div>
        );
      case "hired":
        return (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 font-sans text-center">
            <div className="relative flex items-center justify-center h-14 w-14 rounded-full border border-primary/30 bg-primary/5">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-text-main">Verification Verified</div>
              <div className="text-[10px] font-mono text-text-sub uppercase tracking-wider">Credential ID: SF-8902-X9</div>
            </div>
            <div className="w-full bg-bg-base p-2.5 border border-border-sharp/80 rounded-sm font-mono text-[9px] text-text-dim break-all select-all">
              https://skillforge.dev/verify/c488e001
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* 6 Stage Buttons Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStageIndex === idx;

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`flex flex-col items-start p-4 border text-left rounded-sm transition-all duration-200 focus:outline-none cursor-pointer ${
                isSelected
                  ? "border-primary bg-bg-surface text-text-main shadow-md"
                  : "border-border-sharp bg-bg-base/40 text-text-dim hover:border-border-sharp hover:bg-bg-surface/50 hover:text-text-main"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`font-mono text-xs font-bold ${isSelected ? "text-primary" : "text-text-sub"}`}>
                  {stage.num}
                </span>
                <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-text-sub"}`} />
              </div>
              <span className="font-display text-xs font-semibold tracking-wider">{stage.name}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Display Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-bg-surface border border-border-sharp p-6 sm:p-8 rounded-sm items-stretch animate-fade-in-up">
        {/* Info Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 bg-bg-base border border-border-sharp rounded-sm">
                <ActiveIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
                  STAGE {currentStage.num}
                </span>
                <h3 className="font-display text-xl font-bold tracking-tight text-text-main">
                  {currentStage.tagline}
                </h3>
              </div>
            </div>

            <p className="font-sans text-sm text-text-dim leading-relaxed">
              {currentStage.description}
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider block">
              Core Capabilities
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentStage.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-text-main leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual Mock Column */}
        <div className="lg:col-span-5 flex items-center justify-center bg-bg-base border border-border-sharp rounded-sm overflow-hidden p-1">
          <div className="w-full h-full min-h-[220px] bg-bg-surface border border-border-sharp/40 rounded-sm flex flex-col justify-between shadow-inner">
            {/* Window title bar */}
            <div className="flex items-center justify-between border-b border-border-sharp/40 px-4 py-2.5 bg-bg-base/30">
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-border-sharp"></div>
                <div className="h-2 w-2 rounded-full bg-border-sharp"></div>
                <div className="h-2 w-2 rounded-full bg-border-sharp"></div>
              </div>
              <div className="text-[10px] font-mono text-text-sub uppercase tracking-wider">
                skillforge_env
              </div>
              <div className="w-8"></div>
            </div>
            {/* Visual contents */}
            <div className="flex-1 flex flex-col justify-center">
              {renderMockup(currentStage.mockType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
