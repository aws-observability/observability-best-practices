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
  content_type?: 'solution' | 'guide';
  // Solution-only fields — guides legitimately omit these.
  compute_platform?: string[];
  backends?: string[];
  instrumentation?: string;
  setup_complexity?: 'low' | 'medium' | 'high';
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
  setup_complexity: TaxonomyItem[];
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

const COMPLEXITY_CLASS: Record<string, string> = {
  low: styles.badgeLow,
  medium: styles.badgeMedium,
  high: styles.badgeHigh,
};

// Human-friendly synonyms so search "just works" without users knowing our taxonomy.
const SEARCH_SYNONYMS: Record<string, string> = {
  cloudwatch: 'cw cloud watch',
  amp: 'prometheus managed prometheus',
  amg: 'grafana managed grafana',
  xray: 'x-ray tracing',
  otel: 'opentelemetry open telemetry',
  adot: 'opentelemetry distro',
  cwagent: 'cloudwatch agent',
  eks: 'kubernetes k8s elastic kubernetes',
  ecs: 'elastic container service',
  ec2: 'virtual machine vm instance',
  lambda: 'serverless function',
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
  for (const term of [...backends, ...platforms, instrumentation]) {
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
            {workloadTypes.map((item) => {
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
                    {sol.setup_complexity && (
                      <span className={`${styles.badge} ${COMPLEXITY_CLASS[sol.setup_complexity]}`}>
                        {sol.setup_complexity}
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
