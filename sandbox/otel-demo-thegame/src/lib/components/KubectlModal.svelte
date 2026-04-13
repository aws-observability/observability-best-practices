<script lang="ts">
  let { open = $bindable(false) }: { open: boolean } = $props();

  let command = $state('');
  let history = $state<Array<{ cmd: string; out: string; err: string }>>([]);
  let loading = $state(false);
  let inputEl = $state<HTMLInputElement | null>(null);
  let scrollEl = $state<HTMLDivElement | null>(null);
  let suggestions = $state<string[]>([]);
  let selectedIdx = $state(0);
  let historyIdx = $state(-1);
  let savedInput = $state('');

  const SUBCOMMANDS = [
    'get','describe','logs','top','explain','api-resources','api-versions',
    'cluster-info','config','version','auth','diff','events','wait',
  ];
  const RESOURCES = [
    'pods','pod','po','deployments','deployment','deploy','services','service','svc',
    'configmaps','configmap','cm','secrets','secret','namespaces','namespace','ns',
    'nodes','node','no','ingresses','ingress','ing','replicasets','replicaset','rs',
    'statefulsets','statefulset','sts','daemonsets','daemonset','ds','jobs','job',
    'cronjobs','cronjob','cj','endpoints','ep','events','ev',
    'persistentvolumeclaims','pvc','persistentvolumes','pv',
    'serviceaccounts','sa','hpa','networkpolicies','netpol',
  ];
  const FLAGS = [
    '-n','--namespace','-o','--output','-l','--selector','--all-namespaces','-A',
    '--show-labels','--watch','-w','--sort-by','--field-selector','--no-headers',
    '-c','--container','--tail','--since','--previous','-f','--follow',
    '--context','--kubeconfig','-h','--help',
  ];
  const OUTPUT_FORMATS = ['json','yaml','wide','name','jsonpath=','custom-columns='];

  function getCompletions(input: string): string[] {
    const parts = input.trimStart().split(/\s+/);
    const current = parts[parts.length - 1] || '';
    const prev = parts.length > 1 ? parts[parts.length - 2] : '';
    const lower = current.toLowerCase();

    // After -o/--output, suggest formats
    if (prev === '-o' || prev === '--output') {
      return OUTPUT_FORMATS.filter(f => f.startsWith(lower));
    }
    // After -n/--namespace, no static completions
    if (prev === '-n' || prev === '--namespace') return [];
    // Flags
    if (current.startsWith('-')) {
      return FLAGS.filter(f => f.startsWith(current));
    }
    // First word: subcommand
    const nonFlagParts = parts.filter(p => !p.startsWith('-') && !(parts.indexOf(p) > 0 && (parts[parts.indexOf(p)-1] === '-n' || parts[parts.indexOf(p)-1] === '--namespace' || parts[parts.indexOf(p)-1] === '-o' || parts[parts.indexOf(p)-1] === '--output')));
    if (nonFlagParts.length <= 1) {
      return SUBCOMMANDS.filter(s => s.startsWith(lower));
    }
    // Second non-flag word: resource type
    if (nonFlagParts.length === 2) {
      return RESOURCES.filter(r => r.startsWith(lower));
    }
    return [];
  }

  function applySuggestion(s: string) {
    const parts = command.trimStart().split(/\s+/);
    parts[parts.length - 1] = s;
    command = parts.join(' ') + ' ';
    suggestions = [];
    inputEl?.focus();
  }

  $effect(() => { if (open) requestAnimationFrame(() => inputEl?.focus()); });

  function scrollBottom() {
    requestAnimationFrame(() => { if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight; });
  }

  async function run() {
    const trimmed = command.trim();
    if (!trimmed) return;
    suggestions = [];
    history = [...history, { cmd: trimmed, out: '', err: '' }];
    const idx = history.length - 1;
    command = '';
    loading = true;
    scrollBottom();
    try {
      const resp = await fetch('/api/kubectl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
      });
      const data = await resp.json();
      const out = !resp.ok ? '' : (data.output || '(no output)');
      const err = !resp.ok ? (data.error || `Failed (${resp.status})`) : '';
      history = history.map((h, i) => i === idx ? { ...h, out, err } : h);
    } catch (e: any) {
      history = history.map((h, i) => i === idx ? { ...h, err: e.message || 'Network error' } : h);
    } finally {
      loading = false;
      scrollBottom();
      requestAnimationFrame(() => inputEl?.focus());
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = (selectedIdx + 1) % suggestions.length; return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = selectedIdx <= 0 ? suggestions.length - 1 : selectedIdx - 1; return; }
      if (e.key === 'Tab' || (e.key === 'Enter' && suggestions.length > 0)) {
        e.preventDefault();
        applySuggestion(suggestions[selectedIdx]);
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); suggestions = []; return; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = getCompletions(command);
      if (matches.length === 1) { applySuggestion(matches[0]); }
      else if (matches.length > 1) { suggestions = matches; selectedIdx = 0; }
      return;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cmds = history.map(h => h.cmd);
      if (!cmds.length) return;
      if (historyIdx === -1) savedInput = command;
      historyIdx = historyIdx < cmds.length - 1 ? historyIdx + 1 : historyIdx;
      command = cmds[cmds.length - 1 - historyIdx];
      return;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) { historyIdx = -1; command = savedInput; return; }
      historyIdx--;
      command = history.map(h => h.cmd)[history.length - 1 - historyIdx];
      return;
    }
    if (e.key === 'Enter') { e.preventDefault(); historyIdx = -1; run(); }
  }

  function onInput() {
    if (suggestions.length > 0) {
      const matches = getCompletions(command);
      if (matches.length === 0) suggestions = [];
      else { suggestions = matches; selectedIdx = 0; }
    }
  }
</script>

{#if open}
  <div class="shell" role="dialog" aria-label="kubectl">
    <div class="shell-header">
      <span class="shell-title">kubectl</span>
      <div class="header-actions">
        <button class="clear-btn" onclick={() => history = []} aria-label="Clear">Clear</button>
        <button class="close-btn" onclick={() => open = false} aria-label="Close">✕</button>
      </div>
    </div>
    <div class="shell-body" bind:this={scrollEl}>
      {#each history as h}
        <div class="line prompt-line">$ kubectl {h.cmd}</div>
        {#if h.err}<pre class="line error-line">{h.err}</pre>{/if}
        {#if h.out}<pre class="line">{h.out}</pre>{/if}
      {/each}
    </div>
    <div class="shell-input-wrap">
      {#if suggestions.length > 0}
        <ul class="suggestions">
          {#each suggestions as s, i}
            <li
              class="suggestion"
              class:selected={i === selectedIdx}
              onmousedown={(e) => { e.preventDefault(); applySuggestion(s); }}
              onmouseenter={() => selectedIdx = i}
            >{s}</li>
          {/each}
        </ul>
      {/if}
      <div class="shell-input">
        <span class="prompt">$&nbsp;kubectl</span>
        <input
          bind:this={inputEl}
          bind:value={command}
          onkeydown={onKeydown}
          oninput={onInput}
          placeholder="get pods -n otel-demo  (Tab to complete)"
          disabled={loading}
          spellcheck="false"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .shell {
    position: fixed; bottom: 0; left: 0; right: 0; height: 45vh;
    background: #0d1117; border-top: 1px solid #30363d;
    display: flex; flex-direction: column; z-index: 100;
    animation: slideUp 0.15s ease-out;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .shell-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.4rem 1rem; background: #161b22; border-bottom: 1px solid #21262d; flex-shrink: 0;
  }
  .shell-title { color: #8b949e; font-family: 'SF Mono','Fira Code',monospace; font-size: 0.8rem; }
  .header-actions { display: flex; align-items: center; gap: 0.5rem; }
  .clear-btn { background: #1f6feb22; border: 1px solid #1f6feb66; color: #58a6ff; font-size: 0.75rem; cursor: pointer; padding: 0.2rem 0.6rem; border-radius: 4px; }
  .clear-btn:hover { background: #1f6feb44; border-color: #58a6ff; color: #e1e4e8; }
  .close-btn { background: none; border: none; color: #8b949e; font-size: 1rem; cursor: pointer; padding: 0.1rem 0.4rem; border-radius: 4px; }
  .close-btn:hover { color: #e1e4e8; background: #21262d; }
  .shell-body {
    flex: 1; overflow-y: auto; padding: 0.5rem 1rem;
    font-family: 'SF Mono','Fira Code',monospace; font-size: 0.8rem;
  }
  .line { margin: 0; white-space: pre-wrap; word-break: break-all; }
  .prompt-line { color: #3fb950; padding-top: 0.4rem; }
  .error-line { color: #f85149; }
  .line:not(.prompt-line):not(.error-line) { color: #c9d1d9; }
  .shell-input-wrap { position: relative; flex-shrink: 0; }
  .shell-input {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 1rem; border-top: 1px solid #21262d; background: #161b22;
  }
  .prompt { color: #3fb950; font-family: 'SF Mono','Fira Code',monospace; font-size: 0.85rem; white-space: nowrap; }
  input { flex: 1; background: transparent; border: none; color: #e1e4e8; font-family: 'SF Mono','Fira Code',monospace; font-size: 0.85rem; outline: none; }
  input::placeholder { color: #484f58; }
  .suggestions {
    position: absolute; bottom: 100%; left: 1rem; right: 1rem;
    background: #1c2128; border: 1px solid #30363d; border-radius: 6px;
    list-style: none; margin: 0 0 2px; padding: 4px 0;
    max-height: 180px; overflow-y: auto;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.3);
  }
  .suggestion {
    padding: 0.3rem 0.75rem; cursor: pointer;
    font-family: 'SF Mono','Fira Code',monospace; font-size: 0.8rem; color: #c9d1d9;
  }
  .suggestion:hover, .suggestion.selected { background: #30363d; color: #58a6ff; }
</style>
