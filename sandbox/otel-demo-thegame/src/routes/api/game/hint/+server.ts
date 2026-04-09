import { json } from '@sveltejs/kit';
import { getState, setPhase } from '$lib/server/game-state';

export async function GET() {
  const state = getState();
  if (!state.activeScenario) {
    return json({ error: 'No active scenario' }, { status: 400 });
  }

  setPhase('hypothesis');

  return json({
    hint: state.activeScenario.hint,
    expectedSymptoms: state.activeScenario.expectedSymptoms,
    phase: 'hypothesis',
  });
}
