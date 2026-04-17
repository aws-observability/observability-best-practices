import { json } from '@sveltejs/kit';
import { getState } from '$lib/server/game-state';

export async function GET() {
  return json(getState());
}
