// Stores the latest LLM score between the hypothesis and remediate endpoints
let lastLlmScore: number | null = null;

export function setLastLlmScore(score: number | null) {
  lastLlmScore = score;
}

export function getLastLlmScore(): number | null {
  const s = lastLlmScore;
  lastLlmScore = null;
  return s;
}
