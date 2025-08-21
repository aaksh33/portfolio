import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";

// Fetch repos with README images and descriptions
async function getRepos() {
  const res = await fetch(
    `https://api.github.com/users/${personalData.devUsername}/repos`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch repositories");
  }

  const repos = await res.json();

  // fetch README images + description for each repo
  const reposWithDetails = await Promise.all(
    repos.map(async (repo) => {
      try {
        const readmeRes = await fetch(
          `https://raw.githubusercontent.com/${personalData.devUsername}/${repo.name}/main/README.md`
        );

        let readmeDescription = "";
        let imageUrl = null;

        if (readmeRes.ok) {
          const readmeText = await readmeRes.text();

          // extract first image using regex ![alt](url)
          const imageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
          imageUrl = imageMatch ? imageMatch[1] : null;

          // extract first paragraph (non-empty line of text)
          const descMatch = readmeText
            .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith("#")); // ignore headings

          readmeDescription = descMatch.length > 0 ? descMatch[0] : "";

          // ✅ Clean markdown syntax (bold, italic, inline code, links, etc.)
          readmeDescription = readmeDescription
            .replace(/\*\*(.*?)\*\*/g, "$1") // bold → plain
            .replace(/\*(.*?)\*/g, "$1") // italic → plain
            .replace(/`(.*?)`/g, "$1") // inline code → plain
            .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links [text](url) → text
            .replace(/[#>]/g, "") // remove heading/blockquote chars
            .trim();
        }

        return {
          ...repo,
          image: imageUrl,
          fullDescription: readmeDescription || repo.description,
        };
      } catch {
        return { ...repo, image: null, fullDescription: repo.description };
      }
    })
  );

  return reposWithDetails;
}

export default async function Home() {
  const repos = await getRepos(); // ✅ don’t pass param, function already uses personalData.devUsername

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

