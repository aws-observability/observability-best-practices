import React from 'react';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ApmEnablementGuide from './ApmEnablementGuide';

export default function ApmEnablementGuideViewer() {
  const {search} = useLocation();
  const combo =
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('combo')
      : new URLSearchParams(search).get('combo')) || '';
  const backHref = useBaseUrl('/apm/language-guides');

  if (!combo) {
    return (
      <div className="apm-doc">
        <div className="guide-callout">
          <h2>Missing guide selector</h2>
          <p>
            Missing <code>?combo=</code>. Go back to <a href={backHref}>Language-Specific Guides</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="apm-doc">
      <div className="guide-meta">
        <a href={backHref}>← All language guides</a>
        <span className="guide-src">
          Combo: <code>{combo}</code>
        </span>
      </div>
      <ApmEnablementGuide combo={combo} />
    </div>
  );
}

