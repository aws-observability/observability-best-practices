<script lang="ts">
  let { minutes = $bindable(60) }: { minutes: number } = $props();

  const steps = [
    { label: '1h',  value: 60 },
    { label: '6h',  value: 360 },
    { label: '24h', value: 1440 },
    { label: '3d',  value: 4320 },
    { label: '1w',  value: 10080 },
  ];

  // Deduplicate for the slider (24h and 1d are the same value)
  const sliderSteps = [...new Map(steps.map(s => [s.value, s])).values()];

  function stepIndex(): number {
    const idx = sliderSteps.findIndex(s => s.value === minutes);
    return idx >= 0 ? idx : 0;
  }

  function formatLabel(m: number): string {
    if (m >= 1440) {
      const d = m / 1440;
      if (d === 7) return '1w';
      return d % 1 === 0 ? `${d}d` : `${Math.floor(d)}d ${((d % 1) * 24).toFixed(0)}h`;
    }
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem ? `${h}h ${rem}m` : `${h}h`;
    }
    return `${m}m`;
  }

  function onSlider(e: Event) {
    const idx = parseInt((e.target as HTMLInputElement).value);
    minutes = sliderSteps[idx].value;
  }
</script>

<div class="time-range">
  <span class="label">⏱ Range</span>
  <div class="presets">
    {#each steps as p}
      <button
        class="preset-btn"
        class:active={minutes === p.value}
        onclick={() => { minutes = p.value; }}
      >{p.label}</button>
    {/each}
  </div>
  <span class="slider-bound">1h</span>
  <input
    type="range"
    min={0}
    max={sliderSteps.length - 1}
    step="1"
    value={stepIndex()}
    oninput={onSlider}
    class="slider"
    aria-label="Time range"
  />
  <span class="slider-bound">1w</span>
  <span class="value">{formatLabel(minutes)}</span>
</div>

<style>
  .time-range {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 1rem;
    background: #161b22;
    border-radius: 8px;
    border: 1px solid #30363d;
    flex-wrap: wrap;
  }
  .label {
    color: #8b949e;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .presets {
    display: flex;
    gap: 0.25rem;
  }
  .preset-btn {
    background: #21262d;
    border: 1px solid #30363d;
    color: #8b949e;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .preset-btn:hover { border-color: #58a6ff; color: #c9d1d9; }
  .preset-btn.active { background: #1f6feb33; color: #58a6ff; border-color: #58a6ff; }
  .slider {
    flex: 1;
    min-width: 80px;
    height: 4px;
    accent-color: #58a6ff;
    cursor: pointer;
  }
  .slider-bound {
    color: #6e7681;
    font-size: 0.65rem;
    flex-shrink: 0;
  }
  .value {
    color: #e1e4e8;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 2.5rem;
    text-align: right;
  }
</style>
