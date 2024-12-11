<script lang="ts" context="module">
  import { Commands, ToolNames } from "./interface";

  import {
    Pen,
    Redo,
    Undo,
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
    [ToolNames.SELECT]: MousePointer2,
    [ToolNames.LINE]: Slash,
    [ToolNames.RECTANGLE]: RectangleHorizontal,
    [ToolNames.ELLIPSE]: Circle,
    [ToolNames.TRIANGLE]: Triangle,
    [ToolNames.POLYGON]: Hexagon,
    [ToolNames.SPLINE]: Spline,
    [ToolNames.TEXT]: CaseSensitive,
    [ToolNames.PEN]: Pen,
  } as const);

  const commands = Object.freeze({
    [Commands.UNDO]: Undo,
    [Commands.REDO]: Redo,
  } as const);
</script>

<script lang="ts">
  import clsx from "clsx";

  let { selected, handleSelectTool, handleCommand } = $props<{
    selected: ToolNames;
    handleCommand: (cmd: Commands) => void;
    handleSelectTool: (tool: ToolNames) => void;
  }>();
</script>

<!-- Shapes -->
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

<div style="width: 2.5px; height: 100%;" class="mx-2 leading-none bg-black">
  &nbsp;
</div>

<!-- Commands -->
{#each Object.entries(commands) as [cmd, Icon]}
  <div class="tooltip tooltip-top" data-tip={cmd}>
    <button
      class={clsx("btn btn-square btn-outline btn-xs")}
      onclick={() => handleCommand(cmd)}
    >
      <Icon />
    </button>
  </div>
{/each}
