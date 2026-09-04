import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/SessionProvider";
import AiTutorOrb from "@/components/ai/AiTutorOrb";

export const metadata: Metadata = {
  title: "SkillForge by Code404 — Learn. Build. Practice. Get Hired.",
  description:
    "SkillForge is a premium, structured student learning, skill development, coding practice, guided projects, and placement preparation platform.",
  keywords: [
    "EdTech",
    "Coding Practice",
    "Software Engineering Roadmaps",
    "Portfolio Projects",
    "Placement Preparation",
    "Code404",
  ],
  authors: [{ name: "Code404" }],
  openGraph: {
    title: "SkillForge by Code404",
    description:
      "Learn. Build. Practice. Get Hired. A structured tech career-development platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg-base text-text-main font-sans min-h-screen flex flex-col justify-between selection:bg-primary/20 selection:text-text-main">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <AiTutorOrb />
        </Providers>
      </body>
    </html>
  );
}