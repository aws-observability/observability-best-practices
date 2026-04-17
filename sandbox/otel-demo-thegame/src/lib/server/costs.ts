import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetTagsCommand,
} from '@aws-sdk/client-cost-explorer';

const ceClient = new CostExplorerClient({ region: 'us-east-1' }); // CE is global, always us-east-1
const DEPLOY_REGION = process.env.AWS_REGION || 'eu-west-1';
const PROJECT_TAG = 'Project';
const PROJECT_TAG_VALUE = 'otel-chaos-game';

export interface CostService {
  service: string;
  cost: number;
}

export interface CostSubCategory {
  name: string;
  total: number;
  services: CostService[];
}

export interface CostCategory {
  name: string;
  total: number;
  services: CostService[];
  subCategories?: CostSubCategory[];
}

export interface CostBreakdown {
  startDate: string;
  endDate: string;
  currency: string;
  categories: CostCategory[];
  grandTotal: number;
  splitCostAllocation: boolean;
}

// Infrastructure services scoped to EKS, EC2, and EBS
const INFRA_SERVICES = [
  'Amazon Elastic Container Service for Kubernetes',
  'Amazon Elastic Compute Cloud - Compute',
  'EC2 - Other',
];

// CloudWatch usage types that map to each observability sub-category.
const CW_USAGE_PREFIXES: Record<string, string[]> = {
  'Logs Ingest':    ['DataProcessing-Bytes', 'VendedLog-Bytes', 'DataScanned-Bytes'],
  'Logs Query':     ['LogsQuery', 'Logs-Insights-Queries'],
  'Metrics Ingest': ['MetricMonitorUsage', 'CW:MetricStreamUsage', 'MetricStreamRecords'],
  'Metrics Query':  ['MetricQuery', 'GMD-Metrics', 'GetMetricData'],
  'Traces Ingest':  ['XRay-TracesStored', 'X-Ray-TracesStored'],
  'Traces Query':   ['XRay-TracesScanned', 'X-Ray-TracesRetrieved'],
};

const ALLOWED_SERVICES = [
  ...INFRA_SERVICES,
  'AmazonCloudWatch',
  'Amazon CloudWatch',
  'AWS X-Ray',
];

// ── Infrastructure usage-type classification ─────────────────────────
// Usage types from Cost Explorer are matched against these prefixes/patterns
// to group infra costs into meaningful sub-categories.
const INFRA_USAGE_PREFIXES: Record<string, (ut: string) => boolean> = {
  'Compute':          (ut) => ut.includes('BoxUsage:'),
  'EKS Control Plane':(ut) => ut.includes('AmazonEKS-Hours'),
  'EKS Auto Mode':    (ut) => ut.includes('EKS-Auto:'),
  'Storage':          (ut) => ut.includes('EBS:') || ut.includes('VolumeUsage'),
  'Networking':       (ut) => ut.includes('NatGateway') || ut.includes('DataTransfer'),
};

/**
 * Check whether the Project cost allocation tag has values in CUR,
 * which indicates split cost allocation data is flowing.
 */
async function isSplitCostAllocationActive(startDate: string, endDate: string): Promise<boolean> {
  try {
    const resp = await ceClient.send(
      new GetTagsCommand({
        TimePeriod: { Start: startDate, End: endDate },
        TagKey: PROJECT_TAG,
      }),
    );
    const values = resp.Tags ?? [];
    return values.includes(PROJECT_TAG_VALUE);
  } catch {
    return false;
  }
}

/**
 * Fetch infrastructure usage-type breakdown and classify into sub-categories.
 */
async function getInfraUsageBreakdown(
  startDate: string,
  endDate: string,
  projectTagFilter: Record<string, unknown> | null,
): Promise<CostSubCategory[]> {
  const filters: Record<string, unknown>[] = [
    { Dimensions: { Key: 'REGION', Values: [DEPLOY_REGION] } },
    { Dimensions: { Key: 'SERVICE', Values: INFRA_SERVICES } },
    { Not: { Dimensions: { Key: 'RECORD_TYPE', Values: ['Credit', 'Refund', 'Tax'] } } },
  ];
  if (projectTagFilter) filters.push(projectTagFilter);

  const resp = await ceClient.send(
    new GetCostAndUsageCommand({
      TimePeriod: { Start: startDate, End: endDate },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'USAGE_TYPE' }],
      Filter: { And: filters },
    }),
  );

  // Aggregate usage-type totals
  const usageTotals = new Map<string, number>();
  for (const period of resp.ResultsByTime ?? []) {
    for (const group of period.Groups ?? []) {
      const ut = group.Keys?.[0] ?? 'Unknown';
      const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount ?? '0');
      if (amount < 0.001) continue;
      usageTotals.set(ut, (usageTotals.get(ut) ?? 0) + amount);
    }
  }

  // Classify into sub-categories
  const subCategories: CostSubCategory[] = [];
  const matched = new Set<string>();

  for (const [subName, matchFn] of Object.entries(INFRA_USAGE_PREFIXES)) {
    const services: CostService[] = [];
    let subTotal = 0;
    for (const [ut, cost] of usageTotals) {
      if (matchFn(ut)) {
        // Clean up the usage type name for display
        const label = ut.replace(/^[A-Z]{2}-/, ''); // strip region prefix like "EU-"
        services.push({ service: label, cost });
        subTotal += cost;
        matched.add(ut);
      }
    }
    if (subTotal > 0) {
      services.sort((a, b) => b.cost - a.cost);
      subCategories.push({ name: subName, total: subTotal, services });
    }
  }

  // Anything not matched
  const otherServices: CostService[] = [];
  let otherTotal = 0;
  for (const [ut, cost] of usageTotals) {
    if (!matched.has(ut)) {
      const label = ut.replace(/^[A-Z]{2}-/, '');
      otherServices.push({ service: label, cost });
      otherTotal += cost;
    }
  }
  if (otherTotal > 0) {
    otherServices.sort((a, b) => b.cost - a.cost);
    subCategories.push({ name: 'Other', total: otherTotal, services: otherServices });
  }

  return subCategories;
}

export async function getCostBreakdown(days = 30): Promise<CostBreakdown> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const start = fmt(startDate);
  const end = fmt(endDate);

  // Check if split cost allocation data is available
  const splitActive = await isSplitCostAllocationActive(start, end);

  const projectTagFilter = splitActive
    ? { Tags: { Key: PROJECT_TAG, Values: [PROJECT_TAG_VALUE] } }
    : null;

  const baseFilters: Record<string, unknown>[] = [
    { Dimensions: { Key: 'REGION', Values: [DEPLOY_REGION] } },
    { Not: { Dimensions: { Key: 'RECORD_TYPE', Values: ['Credit', 'Refund', 'Tax'] } } },
  ];

  // ── Fetch service-level costs ──────────────────────────────────────
  const svcFilters = projectTagFilter
    ? [...baseFilters, projectTagFilter]
    : [...baseFilters, { Dimensions: { Key: 'SERVICE', Values: ALLOWED_SERVICES } }];

  const svcResp = await ceClient.send(
    new GetCostAndUsageCommand({
      TimePeriod: { Start: start, End: end },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
      Filter: { And: svcFilters },
    }),
  );

  // ── Fetch CloudWatch usage-type breakdown ──────────────────────────
  const cwFilters: Record<string, unknown>[] = [
    ...baseFilters,
    {
      Dimensions: {
        Key: 'SERVICE',
        Values: ['AmazonCloudWatch', 'Amazon CloudWatch', 'AWS X-Ray'],
      },
    },
  ];
  if (projectTagFilter) cwFilters.push(projectTagFilter);

  const cwResp = await ceClient.send(
    new GetCostAndUsageCommand({
      TimePeriod: { Start: start, End: end },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'USAGE_TYPE' }],
      Filter: { And: cwFilters },
    }),
  );

  let currency = 'USD';

  // ── Aggregate service totals ───────────────────────────────────────
  const serviceTotals = new Map<string, number>();
  for (const period of svcResp.ResultsByTime ?? []) {
    for (const group of period.Groups ?? []) {
      const svc = group.Keys?.[0] ?? 'Unknown';
      const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount ?? '0');
      currency = group.Metrics?.UnblendedCost?.Unit ?? currency;
      serviceTotals.set(svc, (serviceTotals.get(svc) ?? 0) + amount);
    }
  }

  // ── Aggregate CloudWatch usage-type totals ─────────────────────────
  const usageTotals = new Map<string, number>();
  for (const period of cwResp.ResultsByTime ?? []) {
    for (const group of period.Groups ?? []) {
      const ut = group.Keys?.[0] ?? 'Unknown';
      const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount ?? '0');
      usageTotals.set(ut, (usageTotals.get(ut) ?? 0) + amount);
    }
  }

  // ── Build Infrastructure category (EKS, EC2, EBS) ─────────────────
  const infraServices: CostService[] = [];
  let infraTotal = 0;
  for (const [svc, cost] of serviceTotals) {
    const isInfra = projectTagFilter
      ? !['AmazonCloudWatch', 'Amazon CloudWatch', 'AWS X-Ray'].includes(svc)
      : INFRA_SERVICES.includes(svc);
    if (!isInfra || cost < 0.001) continue;
    infraServices.push({ service: svc, cost });
    infraTotal += cost;
  }
  infraServices.sort((a, b) => b.cost - a.cost);

  // Fetch usage-type based infra breakdown (Compute, EKS, Storage, Networking)
  let infraSubCategories: CostSubCategory[] | undefined;
  try {
    const breakdown = await getInfraUsageBreakdown(start, end, projectTagFilter);
    if (breakdown.length > 0) infraSubCategories = breakdown;
  } catch (e: any) {
    console.warn('[costs] Infra usage breakdown failed:', e?.message ?? e);
  }

  // ── Build Observability category with CloudWatch sub-categories ────
  const subCategories: CostSubCategory[] = [];
  let obsTotal = 0;

  for (const [subName, prefixes] of Object.entries(CW_USAGE_PREFIXES)) {
    const matched: CostService[] = [];
    let subTotal = 0;
    for (const [ut, cost] of usageTotals) {
      if (cost < 0.001) continue;
      if (prefixes.some((p) => ut.includes(p))) {
        matched.push({ service: ut, cost });
        subTotal += cost;
      }
    }
    matched.sort((a, b) => b.cost - a.cost);
    subCategories.push({ name: subName, total: subTotal, services: matched });
    obsTotal += subTotal;
  }

  // Anything from CloudWatch / X-Ray not matched to a sub-category
  const matchedUsageTypes = new Set(
    subCategories.flatMap((sc) => sc.services.map((s) => s.service)),
  );
  const otherObs: CostService[] = [];
  let otherObsTotal = 0;
  for (const [ut, cost] of usageTotals) {
    if (cost < 0.001 || matchedUsageTypes.has(ut)) continue;
    otherObs.push({ service: ut, cost });
    otherObsTotal += cost;
  }
  if (otherObs.length > 0) {
    otherObs.sort((a, b) => b.cost - a.cost);
    subCategories.push({ name: 'Other', total: otherObsTotal, services: otherObs });
    obsTotal += otherObsTotal;
  }

  // ── Assemble final breakdown ───────────────────────────────────────
  const categories: CostCategory[] = [
    {
      name: 'Infrastructure',
      total: infraTotal,
      services: infraServices,
      subCategories: infraSubCategories,
    },
    { name: 'Observability', total: obsTotal, services: [], subCategories },
  ];

  const grandTotal = categories.reduce((s, c) => s + c.total, 0);

  return {
    startDate: start,
    endDate: end,
    currency,
    categories,
    grandTotal,
    splitCostAllocation: splitActive,
  };
}
