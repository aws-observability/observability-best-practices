import React, { useCallback, useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

/**
 * Building blocks for the "re:Invent 2026 Cloud Operations Resources" guide.
 *
 * - ReinventHero: dark, re:Invent-styled gradient banner with CTA buttons.
 * - ResourceGrid: filterable card grid over a flat resource array.
 * - ResourceCard: a single resource card (whole card is one link).
 *
 * The resource data lives next to the guide (resources.js) so adding a link is
 * one object, with no component changes.
 */

export const TYPES = {
  video: { label: 'Video' },
  blog: { label: 'Blog' },
  guide: { label: 'Guide' },
  demo: { label: 'Demo' },
  workshop: { label: 'Workshop' },
  training: { label: 'Training' },
  docs: { label: 'Docs' },
  tool: { label: 'Tool' },
  event: { label: 'Event' },
};

export const TOPICS = {
  observability: 'Observability & CloudWatch Omni',
  'ai-agents': 'AI & agent observability',
  operations: 'Operations',
  'devops-agent': 'DevOps Agent',
  cost: 'Cost',
  resilience: 'Resilience',
  learning: 'Learning & community',
};

const DEFAULT_EMPTY = 'New resources are on the way. Check back during re:Invent 2026.';

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

// Warn (never throw) on data typos, so a bad value can't break the build.
function warnUnknown(kind, value, title) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn(`ReinventResources: unknown ${kind} "${value}" on "${title}".`);
  }
}

const isExternal = (href) => typeof href === 'string' && /^https?:\/\//.test(href);

function NewTabHint() {
  return <span className={styles.srOnly}> (opens in new tab)</span>;
}

/** Link that picks <Link> for site paths and a new-tab <a> for external URLs. */
function SmartLink({ href, className, children }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
        <NewTabHint />
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Hero banner.
 * - ctas: [{ label, href, variant: 'primary' | 'secondary' }]; a CTA without
 *   an href renders as non-interactive "coming soon" text.
 * - note: optional small line under the CTAs (e.g. "2026 recordings coming soon").
 * - nextStep: optional { lead, text, cta: { label, href } } band attached to the
 *   bottom of the hero, used for the primary "what to do next" ask.
 */
export function ReinventHero({ eyebrow, title, tagline, ctas = [], note, nextStep }) {
  return (
    <section className={styles.hero} aria-labelledby="reinvent-hero-title">
      {eyebrow && <p className={styles.heroEyebrow}>{eyebrow}</p>}
      {/* Not a heading: the page already has its markdown H1 and fixed H2s. */}
      <p id="reinvent-hero-title" className={styles.heroTitle}>
        {title}
      </p>
      {tagline && <p className={styles.heroTagline}>{tagline}</p>}
      {ctas.length > 0 && (
        <div className={styles.heroCtas}>
          {ctas.map((cta) => {
            const variantClass = cta.variant === 'primary' ? styles.ctaPrimary : styles.ctaSecondary;
            // A CTA without an href is a "coming soon" placeholder: render it as
            // non-interactive text so it is not a dead link.
            if (!cta.href) {
              return (
                <span key={cta.label} className={`${variantClass} ${styles.ctaDisabled}`} aria-disabled="true">
                  {cta.label}
                </span>
              );
            }
            return (
              <SmartLink key={cta.label} href={cta.href} className={variantClass}>
                {cta.label}
              </SmartLink>
            );
          })}
        </div>
      )}
      {note && <p className={styles.heroNote}>{note}</p>}
      {nextStep && (
        <div className={styles.heroNext}>
          <p className={styles.heroNextText}>
            {nextStep.lead && <strong className={styles.heroNextLead}>{nextStep.lead}</strong>}{' '}
            {nextStep.text}
          </p>
          {nextStep.cta && nextStep.cta.href && (
            <SmartLink href={nextStep.cta.href} className={styles.heroNextCta}>
              {nextStep.cta.label}
            </SmartLink>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Prominent call-to-action banner, e.g. "register for an upcoming workshop".
 * The title is a <p>, not a heading, so it never disturbs the catalog's
 * required H2 order or the table of contents.
 */
export function WorkshopCallout({ eyebrow, title, children, cta, slim = false }) {
  return (
    <aside className={slim ? `${styles.callout} ${styles.calloutSlim}` : styles.callout} aria-label={title}>
      <div className={styles.calloutBody}>
        {eyebrow && <p className={styles.calloutEyebrow}>{eyebrow}</p>}
        <p className={styles.calloutTitle}>{title}</p>
        {children && <div className={styles.calloutText}>{children}</div>}
      </div>
      {cta && cta.href && (
        <SmartLink href={cta.href} className={styles.calloutCta}>
          {cta.label}
        </SmartLink>
      )}
    </aside>
  );
}

export function ResourceCard({ title, href, type, topics = [], source, description, isNew }) {
  const typeInfo = TYPES[type];
  if (!typeInfo) warnUnknown('type', type, title);
  const badgeClass = typeInfo ? styles[`badge_${type}`] : styles.badge_unknown;
  const topicLabels = topics
    .map((t) => {
      if (!TOPICS[t]) {
        warnUnknown('topic', t, title);
        return null;
      }
      return TOPICS[t];
    })
    .filter(Boolean);

  return (
    <SmartLink href={href} className={styles.card}>
      <span className={styles.cardTop}>
        <span className={`${styles.badge} ${badgeClass}`}>{typeInfo ? typeInfo.label : 'Resource'}</span>
        {isNew && <span className={styles.newPill}>New</span>}
      </span>
      <span className={styles.cardTitle}>{title}</span>
      {description && <span className={styles.cardDesc}>{description}</span>}
      {(source || topicLabels.length > 0) && (
        <span className={styles.cardMeta}>
          {source && <span className={styles.cardSource}>{source}</span>}
          {topicLabels.length > 0 && <span>{topicLabels.join(' · ')}</span>}
        </span>
      )}
    </SmartLink>
  );
}

export default function ResourceGrid({
  resources = [],
  type,
  topic,
  filterable = false,
  // When set (e.g. "topic"), the active topic chip is synced to ?<queryString>=
  // so a filtered view can be shared, e.g. ?type=all&topic=cost.
  queryString,
  emptyText = DEFAULT_EMPTY,
}) {
  const history = useHistory();
  const location = useLocation();
  const [localTopic, setLocalTopic] = useState(null);

  const urlTopic = useMemo(() => {
    if (!queryString) return null;
    const value = new URLSearchParams(location.search).get(queryString);
    return value && TOPICS[value] ? value : null;
  }, [queryString, location.search]);

  const activeTopic = queryString ? urlTopic : localTopic;

  const setActiveTopic = useCallback(
    (next) => {
      if (!queryString) {
        setLocalTopic(next);
        return;
      }
      // Preserve other params (such as the Tabs' ?type=) and the hash.
      const params = new URLSearchParams(location.search);
      if (next) params.set(queryString, next);
      else params.delete(queryString);
      const search = params.toString();
      history.replace({ ...location, search: search ? `?${search}` : '' });
    },
    [queryString, history, location],
  );

  // Apply the static type/topic props first; the chips filter within that set.
  const base = useMemo(() => {
    const types = type ? (Array.isArray(type) ? type : [type]) : null;
    return resources.filter(
      (r) =>
        (!types || types.includes(r.type)) &&
        (!topic || (Array.isArray(r.topics) && r.topics.includes(topic))),
    );
  }, [resources, type, topic]);

  // Only offer chips for topics that have at least one resource in this set.
  const chips = useMemo(
    () =>
      Object.keys(TOPICS)
        .map((key) => ({
          key,
          label: TOPICS[key],
          count: base.filter((r) => Array.isArray(r.topics) && r.topics.includes(key)).length,
        }))
        .filter((c) => c.count > 0),
    [base],
  );

  const shown = activeTopic
    ? base.filter((r) => Array.isArray(r.topics) && r.topics.includes(activeTopic))
    : base;

  return (
    <div className={styles.wrap}>
      {filterable && chips.length > 0 && (
        <>
          <div role="group" aria-label="Filter by topic" className={styles.chips}>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={activeTopic === null}
              onClick={() => setActiveTopic(null)}
            >
              All topics <span className={styles.chipCount}>{base.length}</span>
            </button>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                className={styles.chip}
                aria-pressed={activeTopic === c.key}
                onClick={() => setActiveTopic(c.key)}
              >
                {c.label} <span className={styles.chipCount}>{c.count}</span>
              </button>
            ))}
          </div>
          <p aria-live="polite" className={styles.count}>
            Showing {shown.length} {shown.length === 1 ? 'resource' : 'resources'}
          </p>
        </>
      )}
      {shown.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul className={styles.grid}>
          {shown.map((r) => (
            <li key={r.href} className={styles.gridItem}>
              <ResourceCard {...r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { ResourceGrid };
