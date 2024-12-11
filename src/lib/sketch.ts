import {
  ToolNames,
  ToolStatus,
  type Color,
  type Point,
  type SketchData,
} from "./interface";
import p5 from "p5";
import { fmtColor, isDrawing, isIdle, isSelectTool } from "./util";

const SELECT_BOX_COLOR = Object.freeze([96, 213, 255, 100]) as Color;

type CTX = InstanceType<typeof p5>;

interface RendererArg {
  ctx: CTX;
  cursor: Point;
  $data: SketchData;
}

const shapeRenderers = Object.freeze({
  [ToolNames.SELECT]: drawRect,
  [ToolNames.RECTANGLE]: drawRect,
  [ToolNames.LINE]: drawLine,
} as const);

export function makeSketch($data: SketchData) {
  return function sketch(ctx: CTX) {
    const getCursor = () => [ctx.mouseX || 0, ctx.mouseY || 0] as const;

    ctx.setup = () => {
      ctx.createCanvas(1000, 1000);
    };

    ctx.draw = () => {
      ctx.background("white");

      const cursor = getCursor();

      for (const shape of $data.drawnShapes || []) {
        if (shapeRenderers[shape.type])
          shapeRenderers[shape.type](ctx, shape.arg);
      }

      if ($data.selectedTool) {
        const { selectedTool, toolState } = $data;

        if (!toolState) {
          $data.toolState = { status: ToolStatus.IDLE, data: {} };
        }

        const startPoint = toolState.data.startPoint;

        if (isDrawing($data) && startPoint && shapeRenderers[selectedTool]) {
          shapeRenderers[selectedTool](ctx, {
            end: cursor,
            start: toolState.data.startPoint,
            fill: isSelectTool($data) ? SELECT_BOX_COLOR : undefined,
          });
        }
      }
    };

    ctx.mousePressed = (e: PointerEvent) => {
      const cursor = getCursor();

      // console.log("mousePressed:", cursor, $data.toolState);

      if ($data.selectedTool && isIdle($data)) {
        $data.toolState.status = ToolStatus.DRAWING;
        $data.toolState.data = { startPoint: cursor };
      }
    };

    ctx.mouseReleased = (e: PointerEvent) => {
      const cursor = getCursor();

      if (isDrawing($data)) {
        if (!isSelectTool($data)) {
          $data.drawnShapes.push({
            type: $data.selectedTool,
            arg: { end: cursor, start: $data.toolState.data.startPoint },
          });
        }

        $data.toolState.status = ToolStatus.IDLE;
        $data.toolState.data = {};
      }

      // console.log("mouseReleased:", cursor, $data.toolState);
    };
  };
}

interface DrawRect_Arg {
  end: Point;
  fill?: Color;
  start: Point;
  stroke?: Color;
  strokeWidth?: number;
}

function drawRect(ctx: CTX, arg: DrawRect_Arg) {
  const { end, start, fill = "gray", strokeWidth = 0 } = arg;
  const stroke = arg.stroke || fill;

  const [a, b] = start;
  const [x, y] = end;

  const width = x - a;
  const height = y - b;

  setFill(ctx, fill);
  setStroke(ctx, stroke);

  ctx.strokeWeight(strokeWidth);
  ctx.rect(a, b, width, height);
}

function drawLine(ctx: CTX, arg: Omit<DrawRect_Arg, "fill">) {
  const { end, start, strokeWidth = 1, stroke = "black" } = arg;

  const [a, b] = start;
  const [x, y] = end;

  setStroke(ctx, stroke);

  ctx.strokeWeight(strokeWidth);
  ctx.line(a, b, x, y);
}

function setFill(ctx: CTX, color: string | number[]) {
  // @ts-ignore
  ctx.fill(...fmtColor(color));
}

function setStroke(ctx: CTX, color: string | number[]) {
  // @ts-ignore
  ctx.stroke(...fmtColor(color));
}
