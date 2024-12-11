<script lang="ts">
  import p5 from "p5";
  import { onDestroy } from "svelte";
  import ShapeSelector from "./lib/ShapeSelector.svelte";
  import clsx from "clsx";
  import { makeSketch } from "./lib/sketch";
  import { ToolNames, ToolStatus, type SketchData } from "./lib/interface";

  let p5Instance: p5;
  let canvas: HTMLDivElement;

  let selectedTool: ToolNames = $state(ToolNames.SELECT);

  // svelte-ignore state_referenced_locally
  const sketchData: SketchData = {
    selectedTool,
    drawnShapes: [],
    toolState: { data: {}, status: ToolStatus.IDLE },
  };

  // ------- Event Handlers ----------
  function handleSelectTool(tool: ToolNames) {
    selectedTool = selectedTool === tool ? ToolNames.SELECT : tool;
  }

  // --------- Lifecycle Hooks -----------
  $effect(() => {
    if (canvas && !p5Instance) {
      p5Instance = new p5(makeSketch(sketchData), canvas);
    }

    if (selectedTool !== sketchData.selectedTool)
      sketchData.selectedTool = selectedTool;
  });

  onDestroy(() => {
    if (p5Instance) p5Instance.remove();
  });
</script>

<div
  class="h-screen max-h-screen p-2 overflow-y-scroll border-2 border-red-500"
>
  <div
    class={clsx(
      "rounded shadow w-max mx-auto gap-1",
      "flex items-center justify-center px-5 py-1 border border-black"
    )}
  >
    <ShapeSelector selected={selectedTool} {handleSelectTool} />
  </div>

  <div
    bind:this={canvas}
    class="flex items-center justify-center mt-5 canvas"
  ></div>
</div>

<style>
  :global(.canvas canvas) {
    border: 2px solid black;
    border-radius: 5px;
  }
</style>
