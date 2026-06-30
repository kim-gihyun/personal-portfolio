import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type PostMeta = {
  slug: string;
  file: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readMins: number;
};

export type Post = {
  meta: PostMeta;
  html: string;
};

const POSTS_DIR = path.join(process.cwd(), "public", "posts");

// Curated, ordered metadata (mirrors the original posts.json; template stub omitted).
const RAW_META: Omit<PostMeta, "slug" | "readMins">[] = [
  {
    file: "2026-06-12-ra-progress-3.md",
    title: "RA Progress Report — 3",
    date: "2026-06-12",
    tags: ["research", "TENG", "CAD"],
    excerpt:
      "Pivoting to a TENG glove: C-TPU strain and creep behaviour, the glove concept, and the 3D-printed tensile & bending testers I designed to characterise it — live models inside.",
  },
  {
    file: "2026-06-05-ra-progress-2.md",
    title: "RA Progress Report — 2",
    date: "2026-06-05",
    tags: ["research", "TENG", "3D printing"],
    excerpt:
      "MATLAB-generated gyroid fabric meets a 2019 Prusa: a 33% print success rate, failure analysis under the microscope, and one bright spot — the electrode grid works.",
  },
  {
    file: "2026-05-29-ra-progress-1.md",
    title: "RA Progress Report — 1",
    date: "2026-05-29",
    tags: ["research", "TENG"],
    excerpt:
      "A self-powered TENG input device: the BISNC interface that inspired it, where past approaches fall short, and a gyroid-substrate + C-TPU electrode proposal.",
  },
  {
    file: "2026-05-15-hello-world.md",
    title: "Hello, world",
    date: "2026-05-15",
    tags: ["personal"],
    excerpt: "Why I built this site and what I plan to write about here.",
  },
];

const slugify = (file: string) => file.replace(/\.md$/, "");

function words(md: string) {
  return md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
}

export function getAllPosts(): PostMeta[] {
  return RAW_META.map((m) => {
    let mins = 3;
    try {
      const md = fs.readFileSync(path.join(POSTS_DIR, m.file), "utf8");
      mins = Math.max(1, Math.round(words(md) / 200));
    } catch {
      /* keep default */
    }
    return { ...m, slug: slugify(m.file), readMins: mins };
  });
}

/**
 * Replace `<div class="model-stage" …>…</div>` blocks with hydrate-able
 * placeholders. The source blocks NEST divs (model-stage > model-loader >
 * xh-loader), so a lazy regex would stop at the first inner `</div>`; we walk
 * the markup counting div depth to find the true matching close tag.
 */
function replaceModelStages(html: string): string {
  const open = /<div class="model-stage[^"]*"([^>]*)>/g;
  let out = "";
  let cursor = 0;
  let m: RegExpExecArray | null;

  while ((m = open.exec(html)) !== null) {
    const attrs = m[1];
    const startTagEnd = m.index + m[0].length;

    // walk forward, counting <div …> opens vs </div> closes, from depth 1
    const tag = /<div\b[^>]*>|<\/div>/g;
    tag.lastIndex = startTagEnd;
    let depth = 1;
    let closeEnd = html.length;
    let t: RegExpExecArray | null;
    while ((t = tag.exec(html)) !== null) {
      depth += t[0] === "</div>" ? -1 : 1;
      if (depth === 0) {
        closeEnd = t.index + t[0].length;
        break;
      }
    }

    const model = /data-model="([^"]+)"/.exec(attrs)?.[1] ?? "";
    const rx = /data-rx="([^"]+)"/.exec(attrs)?.[1] ?? "0";
    const src = model.startsWith("/") ? model : `/${model}`;

    out += html.slice(cursor, m.index);
    out += `<div class="post-model" data-model="${src}" data-rx="${rx}"></div>`;
    cursor = closeEnd;
    open.lastIndex = closeEnd;
  }
  out += html.slice(cursor);
  return out;
}

function transformHtml(html: string): string {
  let out = replaceModelStages(html);
  // relative asset paths → absolute
  out = out.replace(/(src|href)="assets\//g, '$1="/assets/');
  // internal post links from the old site → new routes
  out = out.replace(/href="post\.html\?p=([^"]+)\.md"/g, (_m, s) => `href="/blog/${s}/"`);
  return out;
}

export function getPost(slug: string): Post | null {
  const meta = getAllPosts().find((p) => p.slug === slug);
  if (!meta) return null;
  const md = fs.readFileSync(path.join(POSTS_DIR, meta.file), "utf8");
  // drop the leading H1 (rendered from metadata instead)
  const body = md.replace(/^#\s+.*\n/, "");
  const rawHtml = marked.parse(body, { gfm: true, async: false }) as string;
  return { meta, html: transformHtml(rawHtml) };
}
