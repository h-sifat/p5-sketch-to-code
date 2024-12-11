<script lang="ts">
  import {
    Commands,
    ToolNames,
    ToolStatus,
    type SketchData,
  } from "./lib/interface";
  import p5 from "p5";
  import clsx from "clsx";
  import { onDestroy } from "svelte";
  import { makeSketch } from "./lib/sketch";
  import Toolbar from "./lib/Toolbar.svelte";
  import { ShapeStore } from "./lib/states.svelte";

  let p5Instance: p5;
  let canvas: HTMLDivElement;

  // svelte-ignore state_referenced_locally
  let data: SketchData = $state({
    selectedTool: null,
    drawnShapes: new ShapeStore(),
    toolState: { data: {}, status: ToolStatus.IDLE },
  });

  // ------- Event Handlers ----------
  function handleSelectTool(tool: ToolNames) {
    data.selectedTool = data.selectedTool === tool ? ToolNames.SELECT : tool;
  }

  function handleCommand(cmd: Commands) {
    if (cmd in data.drawnShapes) {
      data.drawnShapes[cmd]();
    }
  }

  function shortcutsHandler(e: KeyboardEvent) {
    const hasMetaKey = e.ctrlKey || e.metaKey;

    if (hasMetaKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      handleCommand(Commands.UNDO);
    } else if (hasMetaKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handleCommand(Commands.REDO);
    }
  }

  // --------- Lifecycle Hooks -----------
  window.addEventListener("keydown", shortcutsHandler);

  $effect(() => {
    if (canvas && !p5Instance) {
      p5Instance = new p5(makeSketch(data), canvas);
    }
  });

  onDestroy(() => {
    if (p5Instance) p5Instance.remove();
    window.removeEventListener("keydown", shortcutsHandler);
  });
</script>

<div class="h-screen max-h-screen pt-8 border-2 border-red-500 wrapper">
  <!-- Top toolbar -->
  <div
    class={clsx(
      "rounded shadow w-max mx-auto gap-1 toolbar",
      "flex items-center justify-center px-5 py-1 mb-2  border border-black"
    )}
  >
    <Toolbar selected={data.selectedTool} {handleSelectTool} {handleCommand} />
  </div>

  <div class="left-panel min-w-8"></div>

  <!-- Canvas -->
  <div
    bind:this={canvas}
    class="flex items-center justify-center overflow-auto bg-gray-200 canvas"
  ></div>

  <!-- Left Config Panel -->
  <div class="bg-red-100 right-panel">Config Panel</div>

  <!-- Bootm panel -->
  <div class="bottom-panel min-h-8"></div>
</div>

<style>
  :global(.canvas canvas) {
    border: 2px solid black;
    border-radius: 5px;
  }

  .wrapper {
    display: grid;
    grid-template-columns: min-content 1fr max-content;
    grid-template-rows: min-content 1fr min-content;
    grid-template-areas:
      "toolbar toolbar toolbar"
      "left canvas right"
      "footer footer footer";
  }

  .toolbar {
    grid-area: toolbar;
  }

  .right-panel {
    grid-area: right;
  }

  .left-panel {
    grid-area: left;
  }

  .bottom-panel {
    grid-area: footer;
  }

  .canvas {
    grid-area: canvas;
  }
</style>
