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
  import { is } from "handy-types";

  let p5Instance: p5;
  let canvasContainer: HTMLDivElement;

  // svelte-ignore state_referenced_locally
  let data: SketchData = $state({
    maximize: true,
    selectedTool: null,
    canvasSize: [1000, 1000],
    drawnShapes: new ShapeStore(),
    containerSize: [undefined, undefined],
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
    if (
      !p5Instance &&
      canvasContainer &&
      is<number[]>("finite_number[]", data.containerSize)
    ) {
      p5Instance = new p5(makeSketch(data), canvasContainer);
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
      "flex-center px-5 py-1 mb-2  border border-black"
    )}
  >
    <Toolbar selected={data.selectedTool} {handleSelectTool} {handleCommand} />
  </div>

  <div class="left-panel min-w-8"></div>

  <!-- Canvas -->
  <div
    bind:this={canvasContainer}
    bind:clientWidth={data.containerSize[0]}
    bind:clientHeight={data.containerSize[1]}
    class="overflow-auto bg-gray-200 flex-center canvas"
  ></div>

  <!-- Left Config Panel -->
  <div class="p-2 border border-blue-500 right-panel">
    <h2 class="font-bold">Canvas Size</h2>

    <label class="leading-none flex-center gap-1">
      <input
        type="checkbox"
        class="toggle toggle-xs"
        bind:checked={data.maximize}
      />
      Maximize
    </label>
  </div>

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
