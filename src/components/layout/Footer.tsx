import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const paths = [
    { label: "Software Engineer", href: "#paths" },
    { label: "Full-Stack Developer", href: "#paths" },
    { label: "AI/ML Engineer", href: "#paths" },
    { label: "DevOps Engineer", href: "#paths" },
    { label: "Cybersecurity Analyst", href: "#paths" },
  ];

  const modules = [
    { label: "Career Roadmaps", href: "#journey" },
    { label: "Interactive Courses", href: "#courses" },
    { label: "Coding Practice", href: "#practice" },
    { label: "Guided Projects", href: "#projects" },
    { label: "Resume Builder", href: "#placement" },
    { label: "Credentials Portal", href: "#" },
  ];

  const company = [
    { label: "About Code404", href: "/about" },
    { label: "Engineering standards", href: "#" },
    { label: "System Status", href: "#" },
    { label: "Contact Support", href: "/support" },
  ];

  return (
    <footer className="w-full bg-bg-surface border-t border-border-sharp pt-16 pb-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">

          {/* Logo Column */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-text-main">
                SKILLFORGE
              </span>

              <span className="font-mono text-[9px] tracking-widest text-text-sub uppercase mt-0.5">
                by code404
              </span>
            </div>

            <p className="font-sans text-sm text-text-dim max-w-sm leading-relaxed">
              A comprehensive student learning, skill-development,
              project-building, and placement-preparation platform.
              Build your future today.
            </p>

            <div className="pt-2 font-sans text-xs text-text-sub">
              Learn. Build. Practice. Get Hired.
            </div>
          </div>

          {/* Career Paths */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase">
              Career Paths
            </h4>

            <ul className="space-y-2.5">
              {paths.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-sm text-text-dim hover:text-primary transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase">
              Platform
            </h4>

            <ul className="space-y-2.5">
              {modules.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-sm text-text-dim hover:text-primary transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Code404 */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase">
              Code404
            </h4>

            <ul className="space-y-2.5">
              {company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-sans text-sm text-text-dim hover:text-primary transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border-sharp/40 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="font-sans text-xs text-text-sub">
            &copy; {currentYear} SkillForge. A product of CODE404.
            All rights reserved.
          </p>

          <div className="flex items-center space-x-1 font-mono text-[10px] text-text-sub uppercase tracking-wider">
            <span>System status:</span>

            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse mr-1"></span>

            <span className="text-success font-semibold">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}