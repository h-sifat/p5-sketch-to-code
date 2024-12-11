import {
  ToolNames,
  ToolStatus,
  type CTX,
  type Point,
  type SketchData,
} from "./interface";

export function distance(xa: number, ya: number, xb: number, yb: number) {
  return Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
}

export function isDrawing($data: SketchData) {
  return $data?.toolState?.status === ToolStatus.DRAWING;
}

export function isIdle($data: SketchData) {
  return $data?.toolState?.status === ToolStatus.IDLE;
}

export function fmtColor(color: string | number[]): any[] {
  return Array.isArray(color) ? <any>color : <any>[color];
}

export function isSelectTool(data: SketchData) {
  return data.selectedTool === ToolNames.SELECT;
}

export function constrainToSquare(start: Point, end: Point): Point {
  const [a, b] = start;
  const [x, y] = end;

  const width = Math.abs(x - a);
  const height = Math.abs(y - b);
  const side = Math.min(width, height);

  return [
    a + side * Math.sign(x - a), // New x
    b + side * Math.sign(y - b), // New y
  ];
}

export function approximateTextDimension(arg: { ctx: CTX; text: string }) {
  const { ctx, text } = arg;
  return [ctx.textWidth(text), ctx.textAscent() + ctx.textDescent()];
}
