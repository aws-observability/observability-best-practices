import { env } from '$env/dynamic/private';
import type { ChaosScenario } from '$lib/types';

const JUDGE_PROMPT = `You are a judge, rating the answer provided by the user against the actual root cause. Use a scale from 0 to 100 where 100 means that the answer is entirely correct and 0 means there is no relation to the cause, make the output rating continuos, so for example, if there is some correctness in the users answer use 50, etc.

Respond with ONLY a JSON object in this exact format: {"score": <number>}`;

const EXPLAIN_PROMPT = `You are an observability instructor explaining what went wrong in a microservices system during a chaos engineering exercise. Given the scenario details, write a clear, concise explanation (3-5 sentences) of:
1. What exactly failed and why
2. How the failure cascades through dependent services
3. What signals an engineer should look for in metrics and traces

Use plain language. Do not use markdown. Do not repeat the scenario name.`;

interface JudgeResult {
  score: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

// Cumulative token counters for the session
let totalInputTokens = 0;
let totalOutputTokens = 0;

export function getTokenUsage(): TokenUsage {
  return { inputTokens: totalInputTokens, outputTokens: totalOutputTokens };
}

export function resetTokenUsage() {
  totalInputTokens = 0;
  totalOutputTokens = 0;
}

// ── Per-1K-token pricing (USD) for known models ────────────────────
// Prices sourced from public pricing pages; add entries as needed.
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'amazon.nova-pro-v1:0':       { input: 0.0008, output: 0.0032 },
  'amazon.nova-lite-v1:0':      { input: 0.00006, output: 0.00024 },
  'amazon.nova-micro-v1:0':     { input: 0.000035, output: 0.00014 },
  'anthropic.claude-3-5-sonnet-20241022-v2:0': { input: 0.003, output: 0.015 },
  'anthropic.claude-3-haiku-20240307-v1:0':    { input: 0.00025, output: 0.00125 },
  'claude-sonnet-4-20250514':   { input: 0.003, output: 0.015 },
  'claude-3-5-haiku-20241022':  { input: 0.0008, output: 0.004 },
  'gpt-4o':                     { input: 0.0025, output: 0.01 },
  'gpt-4o-mini':                { input: 0.00015, output: 0.0006 },
};

// Fallback pricing when the model isn't in the table
const DEFAULT_PRICING = { input: 0.001, output: 0.004 };

export interface LlmCostBreakdown {
  modelId: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export function getLlmCosts(): LlmCostBreakdown {
  const { rawModelId, provider } = getConfig();
  const pricing = MODEL_PRICING[rawModelId] ?? DEFAULT_PRICING;
  const inputCost = (totalInputTokens / 1000) * pricing.input;
  const outputCost = (totalOutputTokens / 1000) * pricing.output;
  return {
    modelId: rawModelId,
    provider,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

interface LlmResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

// ── Provider config ────────────────────────────────────────────────

function getConfig() {
  return {
    region: env.AWS_REGION || 'us-east-1',
    rawModelId: env.LLM_MODEL_ID || 'amazon.nova-pro-v1:0',
    apiKey: env.LLM_API_KEY || '',
    provider: (env.LLM_PROVIDER || 'bedrock').toLowerCase(),
    endpoint: env.LLM_ENDPOINT || '',
  };
}

// ── Generic LLM call ───────────────────────────────────────────────

async function llmCall(systemPrompt: string, userMessage: string, maxTokens: number): Promise<string> {
  const { region, rawModelId, apiKey, provider, endpoint } = getConfig();

  let resp: LlmResponse;
  if (provider === 'anthropic') {
    resp = await callAnthropic(apiKey, rawModelId, systemPrompt, userMessage, maxTokens);
  } else if (provider === 'openai' || (apiKey && provider !== 'bedrock')) {
    resp = await callOpenAICompatible(apiKey, endpoint, rawModelId, systemPrompt, userMessage, maxTokens);
  } else {
    const modelId = toInferenceProfile(rawModelId, region);
    resp = await callBedrock(region, modelId, systemPrompt, userMessage, maxTokens);
  }

  totalInputTokens += resp.inputTokens;
  totalOutputTokens += resp.outputTokens;
  console.log(`[LLM Tokens] call: in=${resp.inputTokens} out=${resp.outputTokens} | total: in=${totalInputTokens} out=${totalOutputTokens}`);

  return resp.text;
}

// ── Public API ─────────────────────────────────────────────────────

export async function judgeHypothesis(
  hypothesis: string,
  actualCause: string
): Promise<JudgeResult> {
  const userMessage = `Actual root cause: ${actualCause}\n\nUser's answer: ${hypothesis}`;
  const text = await llmCall(JUDGE_PROMPT, userMessage, 64);
  console.log(`[LLM Judge] raw=${text}`);
  return parseScore(text);
}

export async function explainCause(scenario: ChaosScenario): Promise<string> {
  const userMessage = [
    `Scenario: ${scenario.name}`,
    `Category: ${scenario.category}`,
    `Description: ${scenario.description}`,
    `Affected services: ${scenario.targetServices.join(', ')}`,
    `Expected symptoms: ${scenario.expectedSymptoms.join('; ')}`,
    `Hint: ${scenario.hint}`,
  ].join('\n');

  const text = await llmCall(EXPLAIN_PROMPT, userMessage, 300);
  console.log(`[LLM Explain] raw=${text}`);
  return text.trim();
}

// ── Inference profile helper ───────────────────────────────────────

function toInferenceProfile(modelId: string, region: string): string {
  if (/^(us|eu|ap)\./i.test(modelId)) return modelId;
  if (modelId.startsWith('arn:')) return modelId;
  const prefix = region.startsWith('eu-') ? 'eu'
    : region.startsWith('ap-') ? 'ap'
    : 'us';
  return `${prefix}.${modelId}`;
}

// ── Provider implementations ───────────────────────────────────────

async function callBedrock(
  region: string, modelId: string,
  systemPrompt: string, userMessage: string, maxTokens: number
): Promise<LlmResponse> {
  const { BedrockRuntimeClient, ConverseCommand } = await import(
    '@aws-sdk/client-bedrock-runtime'
  );
  const client = new BedrockRuntimeClient({ region });
  const command = new ConverseCommand({
    modelId,
    messages: [{ role: 'user', content: [{ text: userMessage }] }],
    system: [{ text: systemPrompt }],
    inferenceConfig: { maxTokens, temperature: 0 },
  });
  const response = await client.send(command);
  return {
    text: response.output?.message?.content?.[0]?.text ?? '',
    inputTokens: response.usage?.inputTokens ?? 0,
    outputTokens: response.usage?.outputTokens ?? 0,
  };
}

async function callAnthropic(
  apiKey: string, model: string,
  systemPrompt: string, userMessage: string, maxTokens: number
): Promise<LlmResponse> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const data = await resp.json();
  return {
    text: data.content?.[0]?.text ?? '',
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
  };
}

async function callOpenAICompatible(
  apiKey: string, endpoint: string, model: string,
  systemPrompt: string, userMessage: string, maxTokens: number
): Promise<LlmResponse> {
  const resp = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0,
    }),
  });
  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content ?? '',
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
  };
}

// ── Score parser ───────────────────────────────────────────────────

function parseScore(text: string): JudgeResult {
  try {
    const match = text.match(/\{[^}]*"score"\s*:\s*(\d+(?:\.\d+)?)[^}]*\}/);
    if (match) {
      const score = Math.min(100, Math.max(0, parseFloat(match[1])));
      const result = { score: Math.round(score) };
      console.log(`[LLM Judge] parsed score=${result.score}`);
      return result;
    }
  } catch {
    // fall through
  }
  console.warn(`[LLM Judge] failed to parse score from: ${text}`);
  return { score: 0 };
}
