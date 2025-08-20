import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

// Fetch repos with README images
async function getRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    next: { revalidate: 60 }, // cache for 1 min (optional)
  });

  if (!res.ok) throw new Error("Failed to fetch repos");

  const repos = await res.json();

  const enriched = await Promise.all(
    repos.map(async (repo) => {
      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${personalData.devUsername}/${repo.name}/readme`
        );

        if (!readmeRes.ok) return { ...repo, cover_image: null };

        const readme = await readmeRes.json();
        const content = Buffer.from(readme.content, "base64").toString("utf-8");

        // Regex → get first ![](image-url) from README
        const match = content.match(/!\[.*?\]\((.*?)\)/);
        const image = match ? match[1] : null;

        return { ...repo, cover_image: image };
      } catch {
        return { ...repo, cover_image: null };
      }
    })
  );

  return enriched;
}

export default async function Home() {
  const repos = await getRepos(personalData.devUsername);

  return (
    <div suppressHydrationWarning>
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      {/* Pass repos as blogs → so Blog section shows GitHub projects */}
      <Blog blogs={repos} />
      <ContactSection />
    </div>
  );
}
