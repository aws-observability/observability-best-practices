import React, {useEffect, useMemo, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Props = {
  combo: string;
};

export default function ApmEnablementGuide({combo}: Props) {
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Use "clean URL" (no .html) to avoid baseUrl-busting redirects in `docusaurus serve`.
  const src = useBaseUrl(`/apm-src/language-guides/enablement/${encodeURIComponent(combo)}`);

  const resolved = useMemo(() => {
    if (typeof window === 'undefined') return {__html: ''};
    return {__html: html};
  }, [html]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError('');
      setHtml('');
      try {
        const res = await fetch(src, {cache: 'no-cache'});
        if (!res.ok) throw new Error(`Failed to load ${src} (${res.status})`);
        const text = await res.text();
        if (typeof window === 'undefined') return;

        const doc = new DOMParser().parseFromString(text, 'text/html');
        const container = doc.querySelector('.container') || doc.body;
        container.querySelectorAll('script, style, link[rel="stylesheet"]').forEach((n) => n.remove());
        container.querySelectorAll('.header, .back-link').forEach((n) => n.remove());

        // Normalize common blocks so it looks decent in Docusaurus.
        container.querySelectorAll('.section').forEach((n) => {
          const section = doc.createElement('section');
          section.innerHTML = n.innerHTML;
          n.replaceWith(section);
        });
        container.querySelectorAll('.code-block').forEach((n) => {
          const pre = doc.createElement('pre');
          const code = doc.createElement('code');
          code.textContent = n.textContent || '';
          pre.appendChild(code);
          n.replaceWith(pre);
        });

        const calloutMap: Array<[string, string]> = [
          ['highlight', 'guide-callout'],
          ['warning', 'guide-callout'],
          ['success', 'guide-callout'],
        ];
        calloutMap.forEach(([cls, newCls]) => {
          container.querySelectorAll('.' + cls).forEach((n) => {
            n.className = newCls;
          });
        });

        if (!cancelled) setHtml(container.innerHTML);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message || e));
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [src]);

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
          <h2>Unable to load enablement guide</h2>
          <p>{error}</p>
          <p>
            Source: <code>{src}</code>
          </p>
        </div>
      </div>
    );
  }

  return <div className="apm-doc" dangerouslySetInnerHTML={resolved} />;
}

