import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { listBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre NR-13, inspeção, prontuários e boas práticas.",
};

export default async function BlogPage() {
  const posts = await listBlogPosts();

  return (
    <Container className="py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="max-w-prose text-zinc-600 dark:text-zinc-300">
          Conteúdo para SEO e educação do cliente. Você pode adicionar novos posts
          em <code>content/blog</code> (arquivos <code>.mdx</code>).
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:bg-white/5"
          >
            <div className="text-xs text-zinc-500">
              {new Date(post.date).toLocaleDateString("pt-BR")}
            </div>
            <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {post.description}
            </p>
            <div className="mt-5">
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-[color:var(--color-primary)] hover:underline"
              >
                Ler artigo →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}

