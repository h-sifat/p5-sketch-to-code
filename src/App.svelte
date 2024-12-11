<script lang="ts">
  import p5 from "p5";
  import { onDestroy } from "svelte";
  import Toolbar from "./lib/Toolbar.svelte";
  import clsx from "clsx";
  import { makeSketch } from "./lib/sketch";
  import {
    Commands,
    ToolNames,
    ToolStatus,
    type SketchData,
  } from "./lib/interface";
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

<div
  class="h-screen max-h-screen px-2 py-8 overflow-y-scroll border-2 border-red-500"
>
  <div
    class={clsx(
      "rounded shadow w-max mx-auto gap-1",
      "flex items-center justify-center px-5 py-1 border border-black"
    )}
  >
    <Toolbar selected={data.selectedTool} {handleSelectTool} {handleCommand} />
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
