<script>
  import { onMount } from "svelte";
	export let imageData;
	export let winner;

	let canvas;

	onMount(() => {
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
  })
</script>

<span style="display: inline-flex; align-items: center; font-size: 24px; font-family: monospace; margin: 2px 8px;">
  <span style="margin-right: 4px">{winner}</span>
  <canvas bind:this={canvas} width=28 height=28 />
</span>