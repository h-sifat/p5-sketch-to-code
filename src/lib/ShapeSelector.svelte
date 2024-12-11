<script lang="ts" context="module">
  import {
    Pen,
    Slash,
    Circle,
    Spline,
    Hexagon,
    Triangle,
    CaseSensitive,
    MousePointer2,
    RectangleHorizontal,
  } from "lucide-svelte";

  const tools = Object.freeze({
    select: MousePointer2,

    line: Slash,
    rectangle: RectangleHorizontal,
    ellipse: Circle,
    triangle: Triangle,
    polygon: Hexagon,
    spline: Spline,
    text: CaseSensitive,
    pen: Pen,
  });
</script>

<script lang="ts">
  import clsx from "clsx";
  import type { ToolNames } from "./interface";

  let { selected, handleSelectTool } = $props<{
    selected: ToolNames;
    handleSelectTool: (tool: ToolNames) => void;
  }>();
</script>

{#each Object.entries(tools) as [name, Icon]}
  {@const isSelected = name === selected}

  <div class="tooltip tooltip-top" data-tip={name}>
    <button
      class={clsx("btn btn-square btn-xs", {
        "btn-neutral": isSelected,
        "btn-outline": !isSelected,
      })}
      onclick={() => handleSelectTool(name)}
    >
      <Icon />
    </button>
  </div>
{/each}
