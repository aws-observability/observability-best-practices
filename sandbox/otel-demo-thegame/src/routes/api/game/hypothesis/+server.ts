import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { submitHypothesis, getState } from '$lib/server/game-state';
import { judgeHypothesis, explainCause, getTokenUsage } from '$lib/server/llm-judge';
import { setLastLlmScore } from '$lib/server/llm-score-store';

export const POST: RequestHandler = async ({ request }) => {
  const { hypothesis } = await request.json();
  if (!hypothesis || typeof hypothesis !== 'string') {
    return json({ error: 'Hypothesis is required' }, { status: 400 });
  }

  submitHypothesis(hypothesis);
  const state = getState();

  let llmScore: number | null = null;
  let llmExplanation: string | null = null;

  if (state.activeScenario) {
    const causeText = `${state.activeScenario.name}: ${state.activeScenario.description}`;

    // Run judge and explanation in parallel
    const [judgeResult, explanationResult] = await Promise.allSettled([
      judgeHypothesis(hypothesis, causeText),
      explainCause(state.activeScenario),
    ]);

    if (judgeResult.status === 'fulfilled') {
      llmScore = judgeResult.value.score;
    } else {
      console.error('LLM judge failed, falling back to manual scoring:', judgeResult.reason);
    }

    if (explanationResult.status === 'fulfilled') {
      llmExplanation = explanationResult.value;
    } else {
      console.error('LLM explanation failed:', explanationResult.reason);
    }
  }

  setLastLlmScore(llmScore);

  const tokenUsage = getTokenUsage();

  return json({
    phase: state.phase,
    scenario: state.activeScenario,
    hypothesis: state.hypothesis,
    llmScore,
    llmExplanation,
    tokenUsage,
  });
};
