import React from 'react';
import styles from './styles.module.css';
import events from '@site/docs/events/events.json';

export default function RelatedEvents({ topics = [], max = 3 }) {
  const matched = events.filter(
    (event) =>
      Array.isArray(event.topics) &&
      event.topics.some((t) => topics.includes(t)),
  );

  const displayed = matched.slice(0, max);

  if (displayed.length === 0) {
    return (
      <div className={styles.container}>
        <a href="/events/" className={styles.browseLink}>
          Browse all events →
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {displayed.map((event, idx) => (
          <li key={idx} className={styles.row}>
            <div className={styles.rowMain}>
              <span className={styles.formatBadge}>{event.format}</span>
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.eventName}
              >
                {event.name}
              </a>
            </div>
            <div className={styles.rowMeta}>
              {event.date} · {event.time} · {event.location}
            </div>
          </li>
        ))}
      </ul>
      <a href="/events/" className={styles.seeAll}>
        See all events →
      </a>
    </div>
  );
}
