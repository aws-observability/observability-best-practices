import React from 'react';
import styles from './styles.module.css';

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Theme display order and short descriptions. Add/adjust here to change the page sections.
const THEME_ORDER = [
  'One Observability Workshop',
  "CloudWatch Fundamentals & What's New",
  'DevOps Agent',
  'GenAI Observability',
  'Database Observability',
  'Security Visibility',
  'Regional & In-Person Events',
];

const THEME_INFO = {
  'One Observability Workshop':
    'Intensive hands-on labs across the full AWS observability toolset — metrics, alarms, dashboards, logs, application performance monitoring, and AI operations.',
  "CloudWatch Fundamentals & What's New":
    'Get started with Amazon CloudWatch and see the latest observability capabilities launched in recent months.',
  'DevOps Agent':
    'See how AWS DevOps Agent turns operations from reactive break-fix into autonomous, proactive troubleshooting.',
  'GenAI Observability':
    'End-to-end observability for your generative AI stack — models, agents, tools, and applications on Amazon Bedrock and beyond.',
  'Database Observability':
    'Monitor database performance, detect anomalies, and transition from Performance Insights to CloudWatch Database Insights with zero monitoring gaps.',
  'Security Visibility':
    'Hands-on with AWS CloudTrail events in the Amazon CloudWatch unified data store for simplified security visibility.',
  'Regional & In-Person Events':
    'In-person and regional CloudOps events — hands-on observability and operations guidance with the AWS team.',
};

function parseDate(dateStr) {
  const m = (dateStr || '').match(/(\d{1,2})\s+([A-Za-z]{3})/);
  if (!m) return null;
  const now = new Date();
  const month = MONTHS[m[2]] ?? 0;
  const day = parseInt(m[1], 10);
  // Dates without a year: assume current year, but if the date is more than
  // 3 months in the past, assume next year (handles Dec→Jan rollover).
  let year = now.getFullYear();
  const candidate = new Date(year, month, day);
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  if (candidate < threeMonthsAgo) {
    year += 1;
  }
  return new Date(year, month, day);
}

function dateKey(dateStr) {
  const d = parseDate(dateStr);
  return d ? d.getTime() : Number.MAX_SAFE_INTEGER;
}

// Returns true if the session date is today or in the future.
function isFutureOrToday(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

// Display label for a session's location: "Online" is shown as "Virtual".
function locationLabel(location) {
  const loc = (location || '').trim();
  if (/^online$/i.test(loc)) return 'Virtual';
  return loc;
}

// Recognize which region a session's time slot targets (shown instead of the clock time).
function deriveGeo(session, eventName) {
  const loc = (session.location || '').toLowerCase();
  const name = (eventName || '').toLowerCase();
  if (loc.includes('in-person')) {
    if (/m[eé]xico|observabilidad|cloudgenia|synnex/.test(name)) return 'LATAM';
    return 'NAMER';
  }
  const m = (session.time || '').match(/(\d{1,2}):(\d{2})/);
  const hour = m ? parseInt(m[1], 10) : 12;
  if (hour < 8) return 'APJ';
  if (hour < 14) return 'EMEA';
  return 'NAMER';
}

// Flatten one event entry into sessions, each carrying its region, event name and level.
function sessionsForEvent(event) {
  const all = [
    { date: event.date, time: event.time, location: event.location, registerUrl: event.registerUrl },
    ...(event.additionalDates || []),
  ];
  return all.map((s) => ({ ...s, geo: deriveGeo(s, event.name), eventName: event.name, level: event.level }));
}

function GeoBadge({ geo }) {
  return <span className={`${styles.geoBadge} ${styles['geo' + geo]}`}>{geo}</span>;
}

// One card per theme: the soonest session across all events is surfaced as NEXT SESSION,
// and every remaining session (from every event in the theme) is listed in one dropdown.
function ThemeCard({ theme, sessions }) {
  const next = sessions[0];
  const rest = sessions.slice(1);
  if (!next) return null;

  return (
    <article className={styles.eventCard}>
      <h2 className={styles.themeHeading}>{theme}</h2>
      <p className={styles.themeDesc}>{THEME_INFO[theme]}</p>
      <div className={styles.nextSession}>
        <div className={styles.nextMeta}>
          <span className={styles.nextLabel}>
            NEXT SESSION <span className={styles.nextLevel}>LEVEL {next.level}</span>
          </span>
          <span className={styles.nextName}>{next.eventName}</span>
          <span className={styles.nextDate}>{next.date}</span>
          <span className={styles.nextWhere}>
            <GeoBadge geo={next.geo} /> · {locationLabel(next.location)}
          </span>
        </div>
        <a
          className={styles.registerButton}
          href={next.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          REGISTER →
        </a>
      </div>

      {rest.length > 0 && (
        <details className={styles.moreDates}>
          <summary className={styles.moreSummary}>
            {rest.length} more session{rest.length > 1 ? 's' : ''}
          </summary>
          <ul className={styles.dateList}>
            {rest.map((s, j) => (
              <li key={j} className={styles.dateRow}>
                <div className={styles.dateMeta}>
                  <span className={styles.dateWhen}>{s.date}</span>
                  <GeoBadge geo={s.geo} />
                  <span className={styles.dateName}>{s.eventName}</span>
                  <span className={styles.dateLoc}>· {locationLabel(s.location)}</span>
                </div>
                <a
                  className={styles.registerButtonSmall}
                  href={s.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register →
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

export default function EventGrid({ events }) {
  const themes = THEME_ORDER.map((theme) => {
    const sessions = events
      .filter((e) => e.theme === theme)
      .flatMap(sessionsForEvent)
      .filter((s) => isFutureOrToday(s.date))
      .sort((a, b) => dateKey(a.date) - dateKey(b.date));
    return { theme, sessions };
  }).filter((t) => t.sessions.length > 0);

  return (
    <div className={styles.eventsPage}>
      <p className={styles.leadText}>
        Free, live webinars and hands-on workshops from the teams that build and operate AWS Cloud
        Operations services. Browse by topic below — each category shows its soonest session for quick
        sign-up, with every remaining session under <strong>more sessions</strong>. Region is labeled
        on every session.
      </p>

      <div className={styles.eventGrid}>
        {themes.map(({ theme, sessions }) => (
          <ThemeCard key={theme} theme={theme} sessions={sessions} />
        ))}
      </div>
    </div>
  );
}
