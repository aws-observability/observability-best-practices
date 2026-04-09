import { json } from '@sveltejs/kit';
import { pickRandomScenario, triggerScenario } from '$lib/server/chaos-engine';
import { startRound, setPhase, getState, MAX_ROUNDS } from '$lib/server/game-state';

export async function POST() {
  const state = getState();
  if (state.round >= MAX_ROUNDS) {
    return json({
      success: false,
      message: `Game over! You completed all ${MAX_ROUNDS} rounds. Reset to play again.`,
      phase: 'complete',
    });
  }

  const scenario = pickRandomScenario();
  startRound(scenario);

  const result = await triggerScenario(scenario);

  if (result.success) {
    setPhase('observing');
  } else {
    setPhase('idle');
  }

  return json({
    success: result.success,
    message: result.message,
    phase: result.success ? 'observing' : 'idle',
    // Don't reveal the scenario to the player
    category: scenario.category,
  });
}
