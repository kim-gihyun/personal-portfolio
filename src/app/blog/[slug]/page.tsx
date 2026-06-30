import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import { PostBody } from "@/components/blog/PostBody";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
  };
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = all[idx - 1]; // newer
  const prev = all[idx + 1]; // older

  return (
    <article className="page post">
      <header className="post-head shell">
        <Link href="/blog/" className="ulink post-back" data-cursor="link">
          ← The log
        </Link>
        <div className="post-meta readout tnum">
          {fmtDate(post.meta.date)} · {post.meta.readMins} min · GK-26
        </div>
        <h1 className="post-title">{post.meta.title}</h1>
        <div className="post-tags">
          {post.meta.tags.map((t) => (
            <span key={t} className="log-tag">
              {t}
            </span>
          ))}
        </div>
        <div className="hairline" />
      </header>

      <div className="shell post-body-wrap">
        <PostBody html={post.html} />
      </div>

      <nav className="post-nav shell" aria-label="More posts">
        {prev ? (
          <Link href={`/blog/${prev.slug}/`} className="post-nav-link" data-cursor="link">
            <span className="readout">← Older</span>
            <b>{prev.title}</b>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/blog/${next.slug}/`} className="post-nav-link post-nav-next" data-cursor="link">
            <span className="readout">Newer →</span>
            <b>{next.title}</b>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
