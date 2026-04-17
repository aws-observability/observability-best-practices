import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCostBreakdown } from '$lib/server/costs';
import { getLlmCosts } from '$lib/server/llm-judge';

export const GET: RequestHandler = async ({ url }) => {
  const days = parseInt(url.searchParams.get('days') || '30');
  try {
    const breakdown = await getCostBreakdown(days);

    // Always append LLM session costs as a category
    const llm = getLlmCosts();
    const llmServices = llm.inputTokens > 0 || llm.outputTokens > 0
      ? [
          { service: `Input tokens (${llm.inputTokens.toLocaleString()})`, cost: llm.inputCost },
          { service: `Output tokens (${llm.outputTokens.toLocaleString()})`, cost: llm.outputCost },
        ]
      : [];
    const llmCategory = {
      name: 'LLM',
      total: llm.totalCost,
      services: [],
      subCategories: [{
        name: `${llm.provider} / ${llm.modelId}`,
        total: llm.totalCost,
        services: llmServices,
      }],
    };
    breakdown.categories.push(llmCategory);
    breakdown.grandTotal += llm.totalCost;

    return json({
      ...breakdown,
      llmTokens: {
        input: llm.inputTokens,
        output: llm.outputTokens,
        total: llm.inputTokens + llm.outputTokens,
      },
    });
  } catch (err: any) {
    console.error('[costs] Failed:', err.message);
    return json({ error: err.message }, { status: 500 });
  }
};
