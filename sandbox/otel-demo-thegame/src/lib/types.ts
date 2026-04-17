export interface OtelService {
  name: string;
  language: string;
  namespace: string;
  deployment: string;
}

// Static metadata about each service. The `deployment` field is a search hint
// used by the discovery module to match against actual K8s deployment names.
// The real deployment name is resolved at runtime via discoverDeployments().
export const OTEL_SERVICES: OtelService[] = [
  { name: 'accounting', language: '.NET', namespace: 'otel-demo', deployment: 'accounting' },
  { name: 'ad', language: 'Java', namespace: 'otel-demo', deployment: 'ad' },
  { name: 'cart', language: '.NET', namespace: 'otel-demo', deployment: 'cart' },
  { name: 'checkout', language: 'Go', namespace: 'otel-demo', deployment: 'checkout' },
  { name: 'currency', language: 'C++', namespace: 'otel-demo', deployment: 'currency' },
  { name: 'email', language: 'Ruby', namespace: 'otel-demo', deployment: 'email' },
  { name: 'fraud-detection', language: 'Kotlin', namespace: 'otel-demo', deployment: 'fraud-detection' },
  { name: 'frontend', language: 'TypeScript', namespace: 'otel-demo', deployment: 'frontend' },
  { name: 'payment', language: 'JavaScript', namespace: 'otel-demo', deployment: 'payment' },
  { name: 'product-catalog', language: 'Go', namespace: 'otel-demo', deployment: 'product-catalog' },
  { name: 'product-reviews', language: 'Python', namespace: 'otel-demo', deployment: 'product-reviews' },
  { name: 'quote', language: 'PHP', namespace: 'otel-demo', deployment: 'quote' },
  { name: 'recommendation', language: 'Python', namespace: 'otel-demo', deployment: 'recommendation' },
  { name: 'shipping', language: 'Rust', namespace: 'otel-demo', deployment: 'shipping' },
];

export type ChaosCategory =
  | 'pod-kill'
  | 'load-spike'
  | 'resource-pressure'
  | 'network-fault'
  | 'config-fault'
  | 'feature-flag'
  | 'multi-fault'
  | 'cascading'
  | 'data-layer'
  | 'observability-gap'
  | 'race-condition'
  | 'capacity';

export type ChaosDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type RemediationStep = string | {
  instruction: string;
  condition?: string;
  alternatives?: string[];
};

export interface ChaosScenario {
  id: string;
  name: string;
  category: ChaosCategory;
  secondaryCategories?: ChaosCategory[];
  difficulty: ChaosDifficulty;
  description: string;
  targetServices: string[];
  hint: string;
  expectedSymptoms: string[];
  remediationSteps: RemediationStep[];
  triggerDelayMs?: number;
  faultCount?: number;
}

export type GamePhase = 'idle' | 'triggering' | 'observing' | 'hypothesis' | 'reveal' | 'remediate' | 'complete';

export const MAX_ROUNDS = 5;

export interface GameState {
  phase: GamePhase;
  activeScenario: ChaosScenario | null;
  triggeredAt: string | null;
  hypothesis: string;
  score: number;
  round: number;
  history: GameRound[];
}

export interface GameRound {
  scenario: ChaosScenario;
  hypothesis: string;
  correct: boolean;
  score: number;
  timestamp: string;
  roundStartedAt: string;
}

export interface REDMetrics {
  timestamp: string;
  service: string;
  rate: number;
  errors: number;
  duration: number;
}

export interface TraceSpan {
  spanId: string;
  traceId: string;
  parentSpanId: string | null;
  name: string;
  serviceName: string;
  startTime: number;   // epoch ms
  duration: number;     // ms
  statusCode: 'OK' | 'ERROR' | 'UNSET';
  attributes: Record<string, string>;
}

export interface Trace {
  traceId: string;
  spans: TraceSpan[];
  startTime: number;    // epoch ms (earliest span)
  duration: number;     // ms (end of latest span - startTime)
  services: string[];
}
