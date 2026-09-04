import React from "react";
import { db } from "@/lib/db";
import { Globe, Cpu, Hammer, Users, Lightbulb, Trophy } from "lucide-react";

export const revalidate = 0; // Disable caching to ensure updates show immediately

export default async function AboutPage() {
  // Query team members from the database
  let teamMembers: Awaited<ReturnType<typeof db.teamMember.findMany>> = [];
  try {
    teamMembers = await db.teamMember.findMany({
      orderBy: [
        { isFounder: "desc" },
        { joinedDate: "asc" }
      ]
    });
  } catch (error) {
    console.error("Failed to query team members:", error);
  }

  const values = [
    {
      title: "BUILD",
      description: "We focus on building functional, production-ready applications, not just static concepts.",
      icon: Hammer,
    },
    {
      title: "EXPERIMENT",
      description: "We try new libraries, test alternative compilers, and push engineering limits.",
      icon: Cpu,
    },
    {
      title: "COMPETE",
      description: "We participate in hackathons to stress-test our skills under intense conditions.",
      icon: Trophy,
    },
    {
      title: "COLLABORATE",
      description: "We share knowledge, pair-program core systems, and conduct code reviews.",
      icon: Users,
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Editorial Header */}
      <section className="py-24 border-b border-border-sharp bg-bg-surface/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
            ORGANIZATION & COMMUNITY
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-text-main uppercase">
            ABOUT CODE404
          </h1>
          <p className="font-sans text-sm sm:text-base text-text-dim max-w-3xl mx-auto leading-relaxed">
            Code404 started as a student technology and hackathon team founded by <strong className="text-text-main">Manu GV</strong>. It is now growing into a broader student developer community centered around open-source work, workshops, and building real-world software solutions.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-b border-border-sharp bg-bg-surface/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">CORE PILLARS</span>
            <h2 className="font-display text-xl font-bold tracking-tight text-text-main uppercase">WHAT DRIVES OUR COMMUNITY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const ValIcon = val.icon;
              return (
                <div key={val.title} className="bg-bg-surface border border-border-sharp p-5 rounded-sm space-y-4">
                  <div className="flex items-center justify-center h-9 w-9 bg-bg-base border border-border-sharp rounded-sm">
                    <ValIcon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-display text-sm font-bold text-text-main tracking-wide uppercase">{val.title}</h4>
                    <p className="font-sans text-xs text-text-dim leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Team Members Section */}
      <section className="py-24 bg-bg-base relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
              THE CONSTRUCTORS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main uppercase">
              MEET THE TEAM
            </h2>
            <p className="font-sans text-xs sm:text-sm text-text-dim max-w-md mx-auto">
              Our community is database-driven. Members are added and updated from the administration system.
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-bg-surface border border-border-sharp p-6 rounded-sm flex flex-col justify-between space-y-6 hover:border-text-sub transition-colors duration-200"
                >
                  <div className="space-y-4">
                    {/* Member Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-text-main flex items-center gap-2">
                          {member.name}
                          {member.isFounder && (
                            <span className="font-mono text-[8px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                              Founder
                            </span>
                          )}
                        </h3>
                        <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider block mt-1">
                          {member.role}
                        </span>
                      </div>

                      {/* Member Socials */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {member.githubUrl && (
                          <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-text-sub hover:text-text-main transition-colors"
                            aria-label={`${member.name} GitHub`}
                            title="GitHub"
                          >
                            <span className="text-xs font-semibold">GH</span>
                          </a>
                        )}

                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-text-sub hover:text-text-main transition-colors"
                            aria-label={`${member.name} LinkedIn`}
                            title="LinkedIn"
                          >
                            <span className="text-xs font-semibold">in</span>
                          </a>
                        )}

                        {member.portfolioUrl && (
                          <a
                            href={member.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-text-sub hover:text-text-main transition-colors"
                            aria-label={`${member.name} Portfolio`}
                            title="Portfolio"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Member Bio */}
                    <p className="font-sans text-xs text-text-dim leading-relaxed whitespace-pre-line">
                      {member.bio}
                    </p>
                  </div>

                  {/* Member Skills */}
                  {member.skills && (
                    <div className="pt-4 border-t border-border-sharp/40 flex flex-wrap gap-1.5">
                      {member.skills.split(",").map((s: string) => (
                        <span
                          key={s.trim()}
                          className="font-mono text-[9px] text-text-sub bg-bg-base px-2 py-0.5 border border-border-sharp rounded-sm"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border-sharp bg-bg-surface p-12 text-center max-w-xl mx-auto rounded-sm space-y-3">
              <Lightbulb className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-display text-sm font-bold text-text-main uppercase">
                Database Seeding Required
              </h4>
              <p className="font-sans text-xs text-text-dim max-w-sm mx-auto leading-relaxed">
                No team members found in the database. Run `npx prisma db seed` to
                insert the default founder profile records.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Code404 Future Evolution */}
      <section className="py-24 border-t border-border-sharp bg-bg-surface/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-main uppercase">
            GROWTH PIPELINE
          </h2>
          <p className="font-sans text-xs sm:text-sm text-text-dim leading-relaxed max-w-2xl mx-auto">
            Today, Code404 operates as a student technology team exploring advanced products. Our vision is to grow into an open-source hub, hosting technical development workshops, creating real-world software architectures, and bridging peer-learning connections to build local student talent.
          </p>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-text-sub uppercase tracking-widest pt-4 flex-wrap">
            <span>Hackathons</span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
            <span>Open Source</span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
            <span>Products</span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
            <span>Workshops</span>
          </div>
        </div>
      </section>
    </div>
  );
}
