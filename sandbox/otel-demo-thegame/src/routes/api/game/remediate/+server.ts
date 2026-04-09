import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getState, completeRound } from '$lib/server/game-state';
import { cleanupScenario } from '$lib/server/chaos-engine';
import { getLastLlmScore } from '$lib/server/llm-score-store';

export const POST: RequestHandler = async ({ request }) => {
  const { action } = await request.json();
  const state = getState();

  if (!state.activeScenario) {
    return json({ error: 'No active scenario' }, { status: 400 });
  }

  const llmScore = getLastLlmScore();

  if (action === 'auto-remediate') {
    const result = await cleanupScenario(state.activeScenario);
    completeRound(llmScore !== null ? llmScore >= 50 : true, llmScore ?? undefined);
    return json({
      success: result.success,
      message: result.message,
      phase: 'complete',
      state: getState(),
    });
  }

  if (action === 'manual-complete') {
    completeRound(llmScore !== null ? llmScore >= 50 : true, llmScore ?? undefined);
    return json({
      phase: 'complete',
      state: getState(),
    });
  }

  return json({ error: 'Invalid action' }, { status: 400 });
};
