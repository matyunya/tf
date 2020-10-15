<script>
  import SingleResult from "./SingleResult.svelte";

  export let value;
</script>

<div style="width: 100%; padding: 2rem; background-color: #eee; color: black;">
  <h5>Predictions</h5>
  {#if Array.isArray(value)}
    {#each value as { winner, imageData }}
      <SingleResult {winner} {imageData} />
    {/each}
  {/if}
</div>
