import type { Renderer } from "p5";
import {
  type CTX,
  ToolNames,
  ToolStatus,
  type Color,
  type Point,
  type SketchData,
} from "./interface";
import {
  isIdle,
  fmtColor,
  isDrawing,
  isSelectTool,
  constrainToSquare,
  approximateTextDimension,
} from "./util";

const SELECT_BOX_COLOR = Object.freeze([96, 213, 255, 100]) as Color;

const shapeRenderers = Object.freeze({
  [ToolNames.LINE]: drawLine,
  [ToolNames.ELLIPSE]: makeDrawRectOrEllipse(ToolNames.ELLIPSE),
  [ToolNames.SELECT]: makeDrawRectOrEllipse(ToolNames.RECTANGLE),
  [ToolNames.RECTANGLE]: makeDrawRectOrEllipse(ToolNames.RECTANGLE),
} as const);

export function makeSketch($data: SketchData) {
  return function sketch(ctx: CTX) {
    const getCursor = () => [ctx.mouseX || 0, ctx.mouseY || 0] as const;

    // ------- global states --------
    let canvasRenderer: Renderer;
    let isMetaKeyPressed = false;
    let isShiftKeyPressed = false;
    // ------- end global states --------

    const isIrrelevantEvent = (e: PointerEvent | KeyboardEvent) =>
      canvasRenderer ? canvasRenderer.elt !== e.target : false;

    ctx.setup = () => {
      canvasRenderer = ctx.createCanvas(1000, 1000);
    };

    ctx.draw = () => {
      ctx.background("white");
      const cursor = getCursor();

      // Draw existing shapes
      for (const shape of $data.drawnShapes.array) {
        if (shapeRenderers[shape.type])
          shapeRenderers[shape.type](ctx, shape.arg);
      }

      // draw shapes of currently selected tool
      if ($data.selectedTool) {
        const { selectedTool, toolState } = $data;

        // set initial data
        if (!toolState) $data.toolState = { status: ToolStatus.IDLE, data: {} };

        const startPoint = toolState.data.startPoint;

        if (isDrawing($data) && startPoint && shapeRenderers[selectedTool]) {
          const shapeArg = normalizeShapeArg(
            {
              end: cursor,
              start: toolState.data.startPoint,
              isConstrained: isShiftKeyPressed,
              fill: isSelectTool($data) ? SELECT_BOX_COLOR : undefined,
            },
            { isConstrained: isShiftKeyPressed }
          );

          shapeRenderers[selectedTool](ctx, shapeArg);
        }
      }

      drawCursorCoordinate(ctx);
    };

    ctx.mousePressed = (e: PointerEvent) => {
      if (isIrrelevantEvent(e)) return;

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
        // Save the drawn shape
        if (!isSelectTool($data)) {
          const shapeArg = normalizeShapeArg(
            {
              end: cursor,
              isConstrained: isShiftKeyPressed,
              start: $data.toolState.data.startPoint,
            },
            { isConstrained: isShiftKeyPressed }
          );

          $data.drawnShapes.add({ arg: shapeArg, type: $data.selectedTool });
        }

        // reset the tool state
        $data.toolState.status = ToolStatus.IDLE;
        $data.toolState.data = {};
      }

      // console.log("mouseReleased:", cursor, $data.toolState);
    };

    ctx.keyPressed = (e: KeyboardEvent) => {
      isShiftKeyPressed = e.shiftKey;
      isMetaKeyPressed = e.ctrlKey || e.metaKey;
    };

    ctx.keyReleased = () => {
      isMetaKeyPressed = false;
      isShiftKeyPressed = false;
    };
  };
}

function normalizeShapeArg(
  arg: DrawRect_Arg,
  options: { isConstrained?: boolean } = {}
) {
  const { isConstrained = false } = options;

  if (isConstrained) {
    arg.isConstrained = isConstrained;
    arg.constrainedEnd = constrainToSquare(arg.start, arg.end);
  }

  return arg;
}

interface DrawRect_Arg {
  end: Point;
  fill?: Color;
  start: Point;
  stroke?: Color;
  strokeWidth?: number;
  constrainedEnd?: Point;
  isConstrained?: boolean;
}

function drawCursorCoordinate(ctx: CTX) {
  const coordintate = [ctx.mouseX || 0, ctx.mouseY || 0]
    .map((n) => n.toFixed(2))
    .join(", ");

  const [width, height] = approximateTextDimension({
    ctx,
    text: coordintate,
  });

  ctx.textSize(12);
  ctx.fill("black");
  ctx.stroke("white");
  ctx.text(coordintate, ctx.width - width - 4, height / 2 + 5);
}

function makeDrawRectOrEllipse(
  shapeType: ToolNames.RECTANGLE | ToolNames.ELLIPSE
) {
  return function drawRect(ctx: CTX, arg: DrawRect_Arg) {
    const {
      end,
      start,
      fill = "gray",
      strokeWidth = 0,
      isConstrained = false,
    } = arg;

    const stroke = arg.stroke || fill;

    const [a, b] = start;
    const [x, y] =
      isConstrained && arg.constrainedEnd ? arg.constrainedEnd : end;

    let width = x - a;
    let height = y - b;

    setFill(ctx, fill);
    setStroke(ctx, stroke);

    ctx.strokeWeight(strokeWidth);

    if (shapeType === ToolNames.RECTANGLE) ctx.rect(a, b, width, height);
    else if (shapeType === ToolNames.ELLIPSE) ctx.ellipse(a, b, width, height);
  };
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
