import p5 from "p5";
import type { SketchData } from "./interface";

export function makeSketch(data: SketchData) {
  return function sketch(ctx: InstanceType<typeof p5>) {
    ctx.setup = () => {
      ctx.createCanvas(1000, 1000);
    };

    ctx.draw = () => {
      ctx.background("white");
      ctx.stroke("white");
      ctx.fill("black");
      ctx.strokeWeight(2);
      ctx.ellipse(ctx.mouseX || 0, ctx.mouseY || 0, 5);
    };
  };
}
