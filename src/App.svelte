<script lang="ts">
  import p5 from "p5";
  import { onDestroy } from "svelte";

  let p5Instance: p5;
  let canvas: HTMLDivElement;

  function sketch(ctx: InstanceType<typeof p5>) {
    ctx.setup = () => {
      ctx.createCanvas(1000, 1000);
    };

    ctx.draw = () => {
      ctx.background(0);
      ctx.fill(255);
      ctx.ellipse(ctx.mouseX || 0, ctx.mouseY || 0, 50, 50);
    };
  }

  $effect(() => {
    if (canvas && !p5Instance) p5Instance = new p5(sketch, canvas);
  });

  onDestroy(() => {
    if (p5Instance) p5Instance.remove();
  });
</script>

<div
  class="h-screen max-h-screen p-2 overflow-y-scroll border-2 border-red-500"
>
  <div class="border-2 border-red-500"></div>

  <div bind:this={canvas} class="flex items-center justify-center"></div>
</div>
