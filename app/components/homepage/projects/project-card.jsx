// @flow strict
import * as React from "react";

function ProjectCard({ project }) {
  return (
    <div className="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full h-[480px] flex flex-col justify-between">

      {/* Top Bar */}
      <div>
        <div className="flex flex-row">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
          <div className="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
        </div>
        <div className="px-4 lg:px-8 py-3 lg:py-5 relative">
          <div className="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
            <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400"></div>
            <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400"></div>
            <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200"></div>
          </div>
          <p className="text-center ml-3 text-[#16f2b3] text-base lg:text-xl">
            {project.name}
          </p>
        </div>
      </div>

      {/* Image Section */}
      {project.image && /\.(png|jpe?g)$/i.test(project.image) ? (
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
          No Image Available
        </div>
      )}

      {/* Code Styled Info */}
      <div className="overflow-hidden border-indigo-900 px-4 lg:px-8 py-4 lg:py-6 flex-1 flex flex-col">
        <code className="font-mono text-xs md:text-sm lg:text-base flex-1">
          <div>
            <span className="mr-2 text-pink-500">const</span>
            <span className="mr-2 text-white">project</span>
            <span className="mr-2 text-pink-500">=</span>
            <span className="text-gray-400">{'{'}</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-white">name:</span>
              <span className="text-amber-300">&#39;{project.name}&#39;</span>
            <span className="text-gray-400">,</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2">
            <span className=" text-white">tools:</span>
            <span className="text-gray-400">[</span>
            {project.tools?.map((tag, i) => (
              <React.Fragment key={i}>
                  <span className="text-amber-300">&#39;{tag}&#39;</span>
                {project.tools?.length - 1 !== i && (
                  <span className="text-gray-400">, </span>
                )}
              </React.Fragment>
            ))}
            <span className="text-gray-400">],</span>
          </div>
          <div>
            <span className="ml-4 lg:ml-8 mr-2 text-white">myRole:</span>
              <span className="text-orange-400">&#39;{project.role}&#39;</span>
            <span className="text-gray-400">,</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2">
            <span className="text-white">description:</span>
              <span className="text-cyan-400 line-clamp-3">
                &#39;{project.description || "No description provided"}&#39;
              </span>
            <span className="text-gray-400">,</span>
          </div>
          <div className="ml-4 lg:ml-8 mr-2 flex flex-col space-y-1">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                  GitHub &#8594;
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline text-sm"
              >
                  Live Demo &#8594;
              </a>
            )}
          </div>
          <div>
              <span className="text-gray-400">&#123;&#125;&#59;</span>
          </div>
        </code>
      </div>
    </div>
  );
}

export default ProjectCard;
