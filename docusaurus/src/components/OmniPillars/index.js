import React, { useState } from 'react';
import styles from './styles.module.css';

/**
 * Interactive "product tour" stepper for the CloudWatch Omni guide's Guidance
 * section. A left rail of numbered pillars drives a detail panel on the right.
 *
 * Content is passed in from MDX so the copy stays in the doc, not the component.
 * Each pillar: { title, tagline, body, why, tradeoff }. `body` and `why` accept
 * React nodes (so links render); the rest are plain strings.
 */
export default function OmniPillars({ pillars = [] }) {
  const [active, setActive] = useState(0);

  if (!Array.isArray(pillars) || pillars.length === 0) return null;
  const current = pillars[active] || pillars[0];

  return (
    <div className={styles.wrap}>
      <ol className={styles.rail} role="tablist" aria-label="CloudWatch Omni capabilities">
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
        <h4 className={styles.panelTitle}>{current.title}</h4>
        {current.tagline ? <p className={styles.tagline}>{current.tagline}</p> : null}
        <p className={styles.body}>{current.body}</p>
        {current.why ? (
          <div className={styles.why}>
            <span className={styles.whyLabel}>Why it matters</span>
            <p className={styles.whyBody}>{current.why}</p>
          </div>
        ) : null}
        {current.tradeoff ? (
          <div className={styles.tradeoff}>
            <span className={styles.tradeoffLabel}>Trade-off if you skip it</span>
            <p className={styles.tradeoffBody}>{current.tradeoff}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
