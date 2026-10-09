import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Rend du Markdown / MDX provenant du dossier /content.
 * Ajoutez ici des composants React pour les utiliser dans vos fichiers .mdx,
 * par exemple : <Callout>…</Callout>.
 */
const components = {
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-foreground">{children}</div>
  ),
};

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-content">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
      />
    </div>
  );
}
