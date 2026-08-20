import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import events from '@site/docs/events/events.json';

const MONTHS = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Resolve a date string like "Tue 28 Jul" to a real Date.
 *
 * events.json carries no year, so the year is inferred from the weekday name:
 * a given day-and-month falls on a specific weekday only once every several
 * years, so testing the previous, current, and next year yields exactly one
 * match. This keeps working across a year boundary, where assuming "current
 * year" would place a January event eleven months in the past.
 *
 * Returns null when the string cannot be parsed, so callers can decide whether
 * to keep or drop the session rather than crashing on unexpected data.
 */
function parseEventDate(dateStr, today) {
  if (typeof dateStr !== 'string') return null;

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 3) return null;

  const [weekday, dayRaw, monthRaw] = parts;
  const day = parseInt(dayRaw, 10);
  const month = MONTHS[monthRaw];
  if (Number.isNaN(day) || month === undefined) return null;

  const thisYear = today.getFullYear();
  for (const year of [thisYear - 1, thisYear, thisYear + 1]) {
    const candidate = new Date(year, month, day);
    // Guard against rollover, e.g. 31 Feb becoming 3 Mar.
    if (candidate.getMonth() !== month || candidate.getDate() !== day) continue;
    if (WEEKDAYS[candidate.getDay()] === weekday) return candidate;
  }

  // Weekday did not match any nearby year (bad data). Fall back to the current
  // year so the session is still dated rather than silently discarded.
  const fallback = new Date(thisYear, month, day);
  return fallback.getMonth() === month ? fallback : null;
}

/**
 * Flatten an event into its sessions. An event has a primary date plus optional
 * additionalDates, each with its own time, location, and registration URL.
 */
function getSessions(event, today) {
  const raw = [
    { date: event.date, time: event.time, location: event.location, registerUrl: event.registerUrl },
    ...(Array.isArray(event.additionalDates) ? event.additionalDates : []),
  ];

  return raw
    .map((session) => ({
      ...session,
      // Inherit from the parent event when an additionalDates entry omits a field.
      location: session.location || event.location,
      registerUrl: session.registerUrl || event.registerUrl,
      parsed: parseEventDate(session.date, today),
    }))
    .filter((session) => session.parsed !== null);
}

export default function RelatedEvents({ topics = [], max = 3 }) {
  const eventsUrl = useBaseUrl('/events/');

  // Compare on date only: an event running later today is still upcoming.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcoming = events
    .filter(
      (event) =>
        Array.isArray(event.topics) && event.topics.some((t) => topics.includes(t)),
    )
    .map((event) => {
      // Show the soonest session that has not happened yet, not the primary
      // date, which is often the first of a recurring series and long past.
      const future = getSessions(event, today)
        .filter((session) => session.parsed >= today)
        .sort((a, b) => a.parsed - b.parsed);
      return future.length > 0 ? { event, next: future[0] } : null;
    })
    .filter(Boolean)
    // Soonest first, so the most actionable event leads.
    .sort((a, b) => a.next.parsed - b.next.parsed)
    .slice(0, max);

  if (upcoming.length === 0) {
    return (
      <div className={styles.container}>
        <a href={eventsUrl} className={styles.browseLink}>
          Browse all events →
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {upcoming.map(({ event, next }) => (
          <li key={`${event.name}-${next.date}-${next.time}`} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.formatBadge}>{event.format}</span>
              <a
                href={next.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.eventName}
              >
                {event.name}
              </a>
            </div>
            <div className={styles.rowMeta}>
              {next.date} · {next.time} · {next.location}
            </div>
          </li>
        ))}
      </ul>
      <a href={eventsUrl} className={styles.seeAll}>
        See all events →
      </a>
    </div>
  );
}
