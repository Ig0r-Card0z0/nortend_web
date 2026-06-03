import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO string
  tags?: string[];
};

export type BlogPost = BlogPostFrontmatter & {
  slug: string;
};

export async function listBlogPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(BLOG_DIR);
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
        const { data } = matter(raw);
        const fm = data as Partial<BlogPostFrontmatter>;

        return {
          slug,
          title: fm.title ?? slug,
          description: fm.description ?? "",
          date: fm.date ?? new Date().toISOString(),
          tags: fm.tags ?? [],
        } satisfies BlogPost;
      })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlogPostSource(slug: string) {
  const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<BlogPostFrontmatter>;

  return {
    frontmatter: {
      title: fm.title ?? slug,
      description: fm.description ?? "",
      date: fm.date ?? new Date().toISOString(),
      tags: fm.tags ?? [],
    } satisfies BlogPostFrontmatter,
    content,
  };
}

