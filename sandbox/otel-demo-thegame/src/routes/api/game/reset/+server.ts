import { json } from '@sveltejs/kit';
import { resetGame } from '$lib/server/game-state';
import { resetTokenUsage } from '$lib/server/llm-judge';

export async function POST() {
  resetGame();
  resetTokenUsage();
  return json({ success: true, phase: 'idle' });
}
