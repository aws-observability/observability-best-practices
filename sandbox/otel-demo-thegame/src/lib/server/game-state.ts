import type { GameState, ChaosScenario, GameRound } from '$lib/types';
import { MAX_ROUNDS } from '$lib/types';

export { MAX_ROUNDS };

// In-memory game state (single-player, single-instance)
let state: GameState = {
  phase: 'idle',
  activeScenario: null,
  triggeredAt: null,
  hypothesis: '',
  score: 0,
  round: 0,
  history: [],
};

export function getState(): GameState {
  return { ...state };
}

export function startRound(scenario: ChaosScenario) {
  state.phase = 'triggering';
  state.activeScenario = scenario;
  state.triggeredAt = new Date().toISOString();
  state.hypothesis = '';
  state.round++;
}

export function setPhase(phase: GameState['phase']) {
  state.phase = phase;
}

export function submitHypothesis(hypothesis: string) {
  state.hypothesis = hypothesis;
  state.phase = 'reveal';
}

export function completeRound(correct: boolean, llmScore?: number) {
  const points = llmScore ?? (correct ? 100 : 25);
  state.score += points;
  if (state.activeScenario) {
    state.history.push({
      scenario: state.activeScenario,
      hypothesis: state.hypothesis,
      correct,
      score: points,
      timestamp: new Date().toISOString(),
    });
  }
  state.phase = 'complete';
}

export function resetGame() {
  state = {
    phase: 'idle',
    activeScenario: null,
    triggeredAt: null,
    hypothesis: '',
    score: 0,
    round: 0,
    history: [],
  };
}
