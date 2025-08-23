export default function BlogCard({ blog }) {
  return (
    <div className="from-[#0d1224] border-[#1b2c68a0] relative rounded-xl border bg-gradient-to-r to-[#0a0d37] shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col">
      {/* Cover Image */}
      {(blog.cover_image && /\.(png|jpe?g)$/i.test(blog.cover_image)) || (blog.image && /\.(png|jpe?g)$/i.test(blog.image)) ? (
        <img
          src={blog.cover_image && /\.(png|jpe?g)$/i.test(blog.cover_image) ? blog.cover_image : blog.image}
          alt={blog.name}
          className="w-full h-48 object-cover border-b border-[#1b2c68a0]"
        />
      ) : (
        <div className="w-full h-48 bg-[#1a1443] flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-[#16f2b3] mb-2">
          {blog.name}
        </h3>
        <p className="text-sm text-gray-300 flex-1 line-clamp-3">
          {blog.fullDescription || "No description provided"}
        </p>

        {/* Links */}
        <div className="flex justify-between items-center mt-4">
          <a
            href={blog.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm font-medium"
          >
            GitHub →
          </a>
          {blog.homepage && (
            <a
              href={blog.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline text-sm font-medium"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
