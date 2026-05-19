import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Container } from "@/components/container";
import { getBlogPostSource, listBlogPosts } from "@/lib/blog";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { frontmatter } = await getBlogPostSource(params.slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  let source: Awaited<ReturnType<typeof getBlogPostSource>>;
  try {
    source = await getBlogPostSource(params.slug);
  } catch {
    notFound();
  }

  const { content, frontmatter } = source;
  const compiled = await compileMDX<{ title: string }>({
    source: content,
    options: { parseFrontmatter: false },
  });

  return (
    <Container className="py-12">
      <div className="mb-6 text-sm">
        <Link href="/blog" className="text-zinc-600 hover:underline">
          ← Voltar para o blog
        </Link>
      </div>

      <header className="space-y-3">
        <div className="text-xs text-zinc-500">
          {new Date(frontmatter.date).toLocaleDateString("pt-BR")}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {frontmatter.title}
        </h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          {frontmatter.description}
        </p>
      </header>

      <article className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-a:text-[color:var(--color-primary)]">
        {compiled.content}
      </article>
    </Container>
  );
}

