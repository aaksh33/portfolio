// @flow strict
import { personalData } from "@/utils/data/personal-data";
import ProjectCard from "../components/homepage/projects/project-card";

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

        if (!readmeRes.ok)
          return {
            ...repo,
            image: null,
            fullDescription: repo.description || "No description provided",
            tools: repo.topics || [],
            role: "",
          };

        const readmeText = await readmeRes.text();

        // extract first image using regex ![alt](url)
        let imageUrl = null;
        const imageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch && imageMatch[1]) {
          let url = imageMatch[1];

          // Fix GitHub image URLs that use relative paths
          if (/^\.\.?\//.test(url)) {
            url = `https://raw.githubusercontent.com/${personalData.devUsername}/${repo.name}/main/${url.replace(/^\.\/?/, "")}`;
          }

          // ✅ Allow GitHub.com links as well
          if (/^https?:\/\/(www\.)?github\.com/.test(url)) {
            // Convert blob links → raw links
            url = url.replace("github.com", "raw.githubusercontent.com")
                     .replace("/blob/", "/");
          }

          // Accept only png/jpg/jpeg
          if (/\.(png|jpe?g)$/i.test(url)) {
            imageUrl = url;
          }
        }

        // extract first paragraph (non-empty line of text)
        const descMatch = readmeText
          .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0 && !line.startsWith("#")); // ignore headings

        let readmeDescription = descMatch.length > 0 ? descMatch[0] : "";

        // Clean markdown syntax (bold, italic, inline code, links)
        readmeDescription = readmeDescription
          .replace(/\*\*(.*?)\*\*/g, "$1")   // bold → plain
          .replace(/\*(.*?)\*/g, "$1")       // italic → plain
          .replace(/`(.*?)`/g, "$1")         // inline code → plain
          .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links [text](url) → text
          .replace(/[#>]/g, "")              // remove heading/blockquote chars
          .trim();

        return {
          ...repo,
          image: imageUrl,
          fullDescription: readmeDescription || repo.description || "No description provided",
          tools: repo.topics || [],
          role: "",
        };
      } catch (error) {
        return {
          ...repo,
          image: null,
          fullDescription: repo.description || "No description provided",
          tools: [],
          role: "",
        };
      }
    })
  );

  return reposWithDetails;
}

async function Page() {
  const repos = await getRepos();

  return (
    <div id="projects" className="relative z-50 my-12 lg:my-24">
      <div className="sticky top-10">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-[40%] translate-x-1/2 filter blur-3xl opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-[40%] w-fit text-white px-5 py-3 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-full h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((project, index) => (
            <div
              id={`sticky-card-${index + 1}`}
              key={project.id}
              className="sticky-card w-full mx-auto max-w-2xl"
            >
              <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s] bg-white">
                <ProjectCard
                  project={{
                    name: project.name,
                    description: project.fullDescription,
                    image: project.image, // ✅ Pass image to ProjectCard
                    githubUrl: project.html_url, // optional
                    liveDemo: project.homepage, // optional
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
