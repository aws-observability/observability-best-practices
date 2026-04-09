import type { GamePhase, GameRound, REDMetrics } from '$lib/types';

// Reactive store for game stats, shared between page and layout.
// Written by +page.svelte, read by +layout.svelte for the header.

export const gameStats = $state({
  round: 0,
  score: 0,
  phase: 'idle' as GamePhase,
  history: [] as GameRound[],
  metrics: [] as REDMetrics[],
  highlightServices: [] as string[],
  exitRequested: false,
  queryMinutes: 60,
  metricsLoading: false,
  llmTokensIn: 0,
  llmTokensOut: 0,
});
