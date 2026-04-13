import { json } from '@sveltejs/kit';
import { execFile } from 'child_process';

export async function POST({ request }) {
  const { command } = await request.json();
  if (!command || typeof command !== 'string') {
    return json({ error: 'Missing command' }, { status: 400 });
  }

  const args = command.trim().split(/\s+/);
  // Block destructive sub-commands
  const blocked = ['delete', 'apply', 'patch', 'edit', 'replace', 'create', 'drain', 'cordon', 'taint', 'exec'];
  if (blocked.includes(args[0])) {
    return json({ error: `Sub-command "${args[0]}" is not allowed` }, { status: 403 });
  }

  // Auto-limit logs output if no --tail flag provided
  if (args.includes('logs') && !args.includes('--tail')) {
    args.push('--tail', '200');
  }

  try {
    const output = await new Promise<string>((resolve, reject) => {
      execFile('kubectl', args, { timeout: 15_000, maxBuffer: 1024 * 1024 * 5 }, (err, stdout, stderr) => {
        if (err) reject(new Error(stderr || err.message));
        else resolve(stdout);
      });
    });
    return json({ output });
  } catch (e: any) {
    return json({ error: e.message || 'kubectl failed' }, { status: 500 });
  }
}
