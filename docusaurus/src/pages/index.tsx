import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './solutions.module.css';

interface Solution {
  name: string;
  slug: string;
  description: string;
  workload_type: string[];
  signals: string[];
  status: 'active' | 'deprecated' | 'preview';
  last_validated?: string;
  content_type?: 'solution' | 'guide';
  // Solution-only fields — guides legitimately omit these.
  compute_platform?: string[];
  backends?: string[];
  instrumentation?: string;
  time_to_value_minutes?: number;
  iac_available?: string[];
}

interface TaxonomyItem {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

interface RawTaxonomy {
  workload_types: TaxonomyItem[];
  compute_platforms: TaxonomyItem[];
  backends: TaxonomyItem[];
  instrumentation: TaxonomyItem[];
  signals: TaxonomyItem[];
}

interface Catalog {
  generated_at: string;
  schema_version: string;
  solutions: Solution[];
  taxonomy: RawTaxonomy;
}

const SIGNAL_ICONS: Record<string, string> = {
  metrics: '📊',
  logs: '📝',
  traces: '🔗',
  profiling: '🔬',
};

// Human-friendly synonyms so search "just works" without users knowing our taxonomy.
// Keyed by tag value; the matching text is appended to that entry's search haystack.
// Extend this whenever a taxonomy value is added, renamed, or retired.
const SEARCH_SYNONYMS: Record<string, string> = {
  // Backends
  cloudwatch: 'cw cloud watch',
  amp: 'prometheus managed prometheus',
  amg: 'grafana managed grafana',
  xray: 'x-ray tracing',
  opensearch: 'elasticsearch search',
  // Instrumentation
  otel: 'opentelemetry open telemetry',
  adot: 'opentelemetry distro',
  cwagent: 'cloudwatch agent',
  prometheus: 'promql scrape exporter',
  // Compute platforms
  eks: 'kubernetes k8s elastic kubernetes',
  ecs: 'elastic container service containers',
  ec2: 'virtual machine vm instance instances',
  fargate: 'serverless containers',
  lambda: 'serverless function functions',
  sagemaker: 'machine learning ml training inference',
  // Workload groups. These carry only DOMAIN-level vocabulary that describes
  // the whole group. Specific technologies must not go here: putting
  // "kubernetes" on `compute` made every compute entry match it, so searching
  // kubernetes returned EC2 NGINX. Product-specific words come from
  // compute_platform, name, and description, which are per-entry and precise.
  compute: 'infrastructure nodes hosts instances workloads',
  'data-streaming': 'data tier datastore persistence database messaging streaming',
  security: 'compliance audit forensics governance',
  network: 'networking traffic vpc dns latency connectivity',
  operations: 'cloudops operational governance audit trail compliance patching landing zone accounts',
  applications: 'application apm services service code runtime',
  'ai-ml': 'ai ml machine learning genai llm model models agents inference',
};

/** Everything searchable about a solution, flattened into one lowercase haystack.
 *  All list fields are guarded: guide entries omit compute_platform, backends,
 *  instrumentation, and iac_available. */
function buildHaystack(sol: Solution): string {
  const backends = sol.backends ?? [];
  const platforms = sol.compute_platform ?? [];
  const instrumentation = sol.instrumentation ?? '';

  const parts: string[] = [
    sol.name,
    sol.description,
    sol.slug.replace(/-/g, ' '),
    ...(sol.workload_type ?? []),
    ...platforms,
    ...backends,
    ...(sol.signals ?? []),
    instrumentation,
    ...(sol.iac_available ?? []),
    sol.content_type || '',
  ];
  // Expand synonyms so "grafana" finds AMG entries, "kubernetes" finds EKS, etc.
  // Workload groups are included because consolidating the chips retired words
  // like "kubernetes" and "messaging" that users still search for.
  for (const term of [
    ...(sol.workload_type ?? []),
    ...backends,
    ...platforms,
    instrumentation,
  ]) {
    if (SEARCH_SYNONYMS[term]) parts.push(SEARCH_SYNONYMS[term]);
  }
  return parts.join(' ').toLowerCase();
}

function getInitialWorkloads(): string[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  return (params.get('workload') || '').split(',').filter(Boolean);
}

function getInitialSearch(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') || '';
}

function syncUrl(workloads: string[], search: string): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  if (workloads.length > 0) params.set('workload', workloads.join(','));
  if (search) params.set('q', search);
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const PAGE_SIZE = 9;

/** Render "2026-07-15" as "Jul 2026". Parsed as UTC to avoid a local-timezone
 *  shift moving the date back a day west of Greenwich. */
function formatValidated(raw: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return raw;
  const [, year, month, day] = match;
  const dt = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(dt.getTime())) return raw;
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function SolutionsPage(): React.ReactElement {
  const catalogUrl = useBaseUrl('/catalog.json');

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workloads, setWorkloads] = useState<string[]>(getInitialWorkloads);
  const [searchText, setSearchText] = useState<string>(getInitialSearch);
  const [page, setPage] = useState(0);

  const debouncedSearch = useDebounce(searchText, 200);

  // Any filter change puts you back on the first page.
  useEffect(() => {
    setPage(0);
  }, [workloads, debouncedSearch]);

  useEffect(() => {
    if (!catalogUrl) return;
    fetch(catalogUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load catalog: ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('json')) {
          throw new Error(`Expected JSON but got ${contentType}. URL: ${catalogUrl}`);
        }
        return res.json();
      })
      .then((data: Catalog) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [catalogUrl]);

  useEffect(() => {
    syncUrl(workloads, debouncedSearch);
  }, [workloads, debouncedSearch]);

  const toggleWorkload = useCallback((id: string) => {
    setWorkloads((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id],
    );
  }, []);

  // Precompute haystacks once per catalog load.
  const haystacks = useMemo(() => {
    if (!catalog) return new Map<string, string>();
    return new Map(catalog.solutions.map((sol) => [sol.slug, buildHaystack(sol)]));
  }, [catalog]);

  const filteredSolutions = useMemo(() => {
    if (!catalog) return [];
    const terms = debouncedSearch.toLowerCase().split(/\s+/).filter(Boolean);

    return catalog.solutions.filter((sol) => {
      // Workload chips: OR within the row.
      if (workloads.length > 0) {
        const hasWorkload = workloads.some((w) => (sol.workload_type ?? []).includes(w));
        if (!hasWorkload) return false;
      }
      // Search: every term must match somewhere in the metadata.
      if (terms.length > 0) {
        const haystack = haystacks.get(sol.slug) || '';
        if (!terms.every((t) => haystack.includes(t))) return false;
      }
      return true;
    });
  }, [catalog, workloads, debouncedSearch, haystacks]);

  const pageCount = Math.ceil(filteredSolutions.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const pagedSolutions = filteredSolutions.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  if (loading) {
    return (
      <Layout title="Solutions Catalog" description="AWS Observability Solutions Catalog">
        <div className={styles.container}>
          <p>Loading solutions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Solutions Catalog" description="AWS Observability Solutions Catalog">
        <div className={styles.container}>
          <p>Error loading solutions: {error}</p>
        </div>
      </Layout>
    );
  }

  const workloadTypes = catalog!.taxonomy.workload_types || [];
  const totalCount = catalog!.solutions.length;

  // Only render a chip that can actually return something. A taxonomy value may
  // be approved before its content is written (Operations was), and a chip that
  // yields an empty grid reads as a broken filter rather than an empty category.
  // Counting from the data means the chip appears the moment the first entry
  // lands, with no second change required here.
  const workloadCounts = new Map<string, number>();
  for (const sol of catalog!.solutions) {
    for (const w of sol.workload_type ?? []) {
      workloadCounts.set(w, (workloadCounts.get(w) ?? 0) + 1);
    }
  }
  const visibleWorkloads = workloadTypes.filter(
    (item) => (workloadCounts.get(item.id) ?? 0) > 0,
  );

  return (
    <Layout title="Solutions Catalog" description="Discover pre-built AWS Observability solutions">
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Solutions Catalog</h1>
          <p className={styles.subtitle}>
            Pre-built observability solutions for common AWS workloads.
          </p>
        </header>

        {/* Search — the primary tool. Matches names, descriptions, backends,
            platforms, instrumentation, and common synonyms. */}
        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search anything: “kubernetes”, “grafana”, “tracing”, “kafka”..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search solutions"
            autoFocus
          />
        </div>

        {/* One filter question: what are you running? */}
        <div className={styles.filters}>
          <div className={styles.filterGroup} role="group" aria-label="Filter by workload">
            {visibleWorkloads.map((item) => {
              const isActive = workloads.includes(item.id);
              return (
                <button
                  key={item.id}
                  className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                  onClick={() => toggleWorkload(item.id)}
                  aria-pressed={isActive}
                  type="button"
                >
                  {item.icon ? `${item.icon} ` : ''}{item.label}
                </button>
              );
            })}
            {(workloads.length > 0 || searchText) && (
              <button
                className={styles.filterChip}
                onClick={() => { setWorkloads([]); setSearchText(''); }}
                type="button"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        <p className={styles.resultsCount}>
          {filteredSolutions.length > PAGE_SIZE
            ? `Showing ${currentPage * PAGE_SIZE + 1}–${currentPage * PAGE_SIZE + pagedSolutions.length} of ${filteredSolutions.length} solutions`
            : `Showing ${filteredSolutions.length} of ${totalCount} solutions`}
        </p>

        {filteredSolutions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <p className={styles.emptyStateText}>No solutions match</p>
            <p className={styles.emptyStateHint}>Try fewer words, or clear the workload filter.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {pagedSolutions.map((sol) => (
              <Link
                key={sol.slug}
                to={`/solutions/${sol.slug}/`}
                className={`${styles.card} ${sol.status === 'deprecated' ? styles.deprecated : ''}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardName}>
                    {sol.status === 'deprecated' && '⚠️ '}
                    {sol.name}
                  </h3>
                  <div className={styles.cardBadges}>
                    {sol.content_type && (
                      <span className={`${styles.typeTag} ${sol.content_type === 'guide' ? styles.typeGuide : styles.typeSolution}`}>
                        {sol.content_type === 'guide' ? 'Guide' : 'Solution'}
                      </span>
                    )}
                  </div>
                </div>

                <p className={styles.cardDescription}>{sol.description}</p>

                <div className={styles.cardMeta}>
                  <span className={styles.signals} aria-label="Signals">
                    {(sol.signals ?? []).map((sig) => (
                      <span key={sig} title={sig}>{SIGNAL_ICONS[sig] || sig}</span>
                    ))}
                  </span>

                  {(sol.backends ?? []).map((backend) => (
                    <span key={backend} className={styles.backendPill}>{backend}</span>
                  ))}

                  {sol.instrumentation && (
                    <span className={styles.instrumentationBadge}>{sol.instrumentation}</span>
                  )}

                  {typeof sol.time_to_value_minutes === 'number' && (
                    <span className={styles.timeToValue}>
                      ⏱ {sol.time_to_value_minutes}min
                    </span>
                  )}

                  {/* Freshness. Month precision only: last_validated is a
                      re-test date, and day precision implies more than it means. */}
                  {sol.last_validated && (
                    <span className={styles.lastUpdated}>
                      Updated {formatValidated(sol.last_validated)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            </div>

            {pageCount > 1 && (
              <nav className={styles.pagination} aria-label="Catalog pages">
                <button
                  className={styles.pageButton}
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  type="button"
                >
                  ← Previous
                </button>
                <span className={styles.pageIndicator}>
                  Page {currentPage + 1} of {pageCount}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= pageCount - 1}
                  type="button"
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}
