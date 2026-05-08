import React, {useEffect, useMemo, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Props = {
  /** Path inside static `apm-src/` (e.g. `pages/security.html`, `index.html`). */
  src: string;
  /** CSS selector to extract from fetched HTML. Defaults to `article`. */
  selector?: string;
};

function stripDotSegments(path: string) {
  let p = path.replace(/\\+/g, '/');
  while (p.startsWith('./')) p = p.slice(2);
  while (p.startsWith('../')) p = p.slice(3);
  return p;
}

/**
 * Prefer directory-style paths (`pages/foo/`) for fetch: the dev server serves these reliably.
 * GitHub Pages only copies `static/` as flat files (e.g. `pages/foo.html`) with no `foo/index.html`,
 * so `/apm-src/pages/foo/` returns 404 in production — see fetch fallback below.
 */
function apmStaticFetchPath(srcPath: string): string {
  const p = stripDotSegments(srcPath);
  if (p === 'index.html' || p === 'index') return '';
  if (p.endsWith('.html')) {
    return `${p.slice(0, -'.html'.length)}/`;
  }
  return p;
}

/** Actual filename under `static/apm-src/` used when directory URL is missing on static hosts. */
function apmStaticFileRelativePath(srcPath: string): string {
  const p = stripDotSegments(srcPath);
  if (!p || p === 'index') return 'index.html';
  return p.endsWith('.html') ? p : `${p}.html`;
}

export default function ApmHtmlDoc({src, selector = 'article'}: Props) {
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

  const apmSrcBase = useBaseUrl('/apm-src/');
  const apmHome = useBaseUrl('/apm/');
  const apmDocBase = useBaseUrl('/apm/');
  const apmFetchPath = apmStaticFetchPath(src);
  const primaryUrl = useBaseUrl(`/apm-src/${apmFetchPath}`);
  const fallbackUrl = useBaseUrl(`/apm-src/${apmStaticFileRelativePath(src)}`);

  const resolved = useMemo(() => {
    // Avoid SSR crashes: DOMParser/document are browser-only.
    if (typeof window === 'undefined') return {__html: ''};
    return {__html: html};
  }, [html]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError('');
      setHtml('');
      try {
        let res = await fetch(primaryUrl, {cache: 'no-cache'});
        let loadedFrom = primaryUrl;
        if (!res.ok && res.status === 404 && fallbackUrl !== primaryUrl) {
          res = await fetch(fallbackUrl, {cache: 'no-cache'});
          loadedFrom = fallbackUrl;
        }
        if (!res.ok) {
          throw new Error(`Failed to load ${loadedFrom} (${res.status})`);
        }
        const text = await res.text();

        if (typeof window === 'undefined') return;
        const doc = new DOMParser().parseFromString(text, 'text/html');

        const rewriteStatic = (u: string) => {
          if (!u) return u;
          if (/^(https?:|mailto:|tel:|data:)/i.test(u)) return u;
          if (u.startsWith('#')) return u;
          const clean = stripDotSegments(u);
          return `${apmSrcBase}${clean}`;
        };

        const root = doc.querySelector(selector) || doc.body;

        // Remove scripts/styles so docs behave as static content.
        root.querySelectorAll('script, style, link[rel="stylesheet"]').forEach((n) => n.remove());

        const rewriteDocLink = (u: string) => {
          if (!u) return u;
          if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
          if (u.startsWith('#')) return u;

          // Normalize common cw-apm-docs header link patterns.
          if (u === '/' || u === './' || u === '../index.html' || u === '../index.html#') return apmHome;

          // Convert `*.html` links to clean doc routes under `/apm/pages/<name>`.
          const [pathPart, hashPart = ''] = u.split('#');
          const [pathOnly, query = ''] = pathPart.split('?');
          const p = stripDotSegments(pathOnly);

          // Handle links like `pages/getting-started.html` or `getting-started.html`
          const m = p.match(/^(?:pages\/)?([a-z0-9-]+)\.html$/i);
          if (m) {
            const name = m[1];
            const target = `${apmDocBase}${name}`;
            return `${target}${query ? `?${query}` : ''}${hashPart ? `#${hashPart}` : ''}`;
          }

          // Handle `language-guide/?combo=...` (clean-url folder) from cw-apm-docs.
          if (p === 'language-guide/' || p === 'language-guide') {
            const target = `${apmDocBase}language-guide`;
            return `${target}${query ? `?${query}` : ''}${hashPart ? `#${hashPart}` : ''}`;
          }
          if (p === 'language-guides/' || p === 'language-guides') {
            const target = `${apmDocBase}language-guides`;
            return `${target}${query ? `?${query}` : ''}${hashPart ? `#${hashPart}` : ''}`;
          }

          // Fallback: treat as static asset under apm-src.
          return rewriteStatic(u);
        };

        root.querySelectorAll('a[href]').forEach((a) => {
          const href = a.getAttribute('href') || '';
          a.setAttribute('href', rewriteDocLink(href));
        });

        root.querySelectorAll('[src]').forEach((el) => {
          const srcAttr = el.getAttribute('src') || '';
          el.setAttribute('src', rewriteStatic(srcAttr));
        });

        if (!cancelled) setHtml(root.innerHTML);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message || e));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apmDocBase, apmHome, apmSrcBase, fallbackUrl, primaryUrl, selector]);

  if (typeof window === 'undefined') {
    return (
      <div className="apm-doc">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apm-doc">
        <div className="guide-callout">
          <h2>Unable to load page content</h2>
          <p>{error}</p>
          <p>
            Tried: <code>{primaryUrl}</code>
            {fallbackUrl !== primaryUrl && (
              <>
                {' '}
                then <code>{fallbackUrl}</code>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return <div className="apm-doc" dangerouslySetInnerHTML={resolved} />;
}

