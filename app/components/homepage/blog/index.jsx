// @flow strict
"use client"
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import BlogCard from "./blog-card";


import { personalData } from "@/utils/data/personal-data";
import { useEffect, useState } from "react";

function Blog() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRepos() {
      const res = await fetch(
        `https://api.github.com/users/${personalData.devUsername}/repos`
      );
      if (!res.ok) return setRepos([]);
      const repos = await res.json();
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
              const imageMatch = readmeText.match(/!\[.*?\]\((.*?)\)/);
              if (imageMatch && imageMatch[1]) {
                let url = imageMatch[1];
                if (/^\.\.?\//.test(url)) {
                  url = `https://raw.githubusercontent.com/${personalData.devUsername}/${repo.name}/main/${url.replace(/^\.\/?/, "")}`;
                }
                if (/^https?:\/\/(www\.)?github\.com/.test(url)) {
                  url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
                }
                if (/\.(png|jpe?g)$/i.test(url)) {
                  imageUrl = url;
                }
              }
              const descMatch = readmeText
                .replace(/!\[.*?\]\(.*?\)/g, "")
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0 && !line.startsWith("#"));
              readmeDescription = descMatch.length > 0 ? descMatch[0] : "";
              readmeDescription = readmeDescription
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/`(.*?)`/g, "$1")
                .replace(/\[(.*?)\]\(.*?\)/g, "$1")
                .replace(/[#>]/g, "")
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
      setRepos(reposWithDetails);
      setLoading(false);
    }
    getRepos();
  }, []);

  return (
    <div
      id="projects"
      className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]"
    >
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl opacity-20"></div>
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            My Projects
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {loading ? (
          <div className="col-span-3 text-center text-gray-400 py-10">Loading...</div>
        ) : (
          repos.slice(0, 6).map((repo, i) => <BlogCard blog={repo} key={i} />)
        )}
      </div>
      <div className="flex justify-center mt-5 lg:mt-12">
        <Link
          className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
          role="button"
          href="/projects"
        >
          <span>View More</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default Blog;
