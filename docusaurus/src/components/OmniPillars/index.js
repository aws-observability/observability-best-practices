import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * Interactive "product tour" stepper for the CloudWatch Omni guide's Guidance
 * section. A left rail of numbered pillars drives a detail panel on the right.
 *
 * Content is passed in from MDX so the copy stays in the doc, not the component.
 * Each pillar: { title, tagline, body, why, tradeoff, href, linkLabel }. Optional
 * `href` links the title; `linkLabel` repeats that link after the body.
 * `body` and `why` accept React nodes; the rest are plain strings.
 */
export default function OmniPillars({
  pillars = [],
  label = 'CloudWatch Omni capabilities',
  whyLabel = 'Why it matters',
  tradeoffLabel = 'Trade-off if you skip it',
}) {
  const [active, setActive] = useState(0);

  if (!Array.isArray(pillars) || pillars.length === 0) return null;
  const current = pillars[active] || pillars[0];

  return (
    <div className={styles.wrap}>
      <ol className={styles.rail} role="tablist" aria-label={label}>
        {pillars.map((p, i) => {
          const selected = i === active;
          return (
            <li key={p.title} className={styles.railItem}>
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                className={`${styles.pill} ${selected ? styles.pillActive : ''}`}
                onClick={() => setActive(i)}
              >
                <span className={styles.num}>{i + 1}</span>
                <span className={styles.pillTitle}>{p.title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.panel} role="tabpanel" key={active}>
        <div className={styles.panelNum}>{String(active + 1).padStart(2, '0')}</div>
        <h4 className={styles.panelTitle}>
          {current.href ? (
            <Link className={styles.titleLink} to={current.href}>
              {current.title}
              <span className={styles.titleArrow} aria-hidden="true">→</span>
            </Link>
          ) : (
            current.title
          )}
        </h4>
        {current.tagline ? <p className={styles.tagline}>{current.tagline}</p> : null}
        <p className={styles.body}>
          {current.body}
          {current.href && current.linkLabel ? (
            <>
              {' '}
              <Link className={styles.bodyLink} to={current.href}>
                {current.linkLabel} →
              </Link>
            </>
          ) : null}
        </p>
        {current.why ? (
          <div className={styles.why}>
            <span className={styles.whyLabel}>{whyLabel}</span>
            <p className={styles.whyBody}>{current.why}</p>
          </div>
        ) : null}
        {current.tradeoff ? (
          <div className={styles.tradeoff}>
            <span className={styles.tradeoffLabel}>{tradeoffLabel}</span>
            <p className={styles.tradeoffBody}>{current.tradeoff}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
