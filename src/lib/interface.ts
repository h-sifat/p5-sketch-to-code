import type p5 from "p5";

export const enum ToolNames {
  SELECT = "select",

  PEN = "pen",
  LINE = "line",
  TEXT = "text",
  SPLINE = "spline",
  ELLIPSE = "ellipse",
  POLYGON = "polygon",
  TRIANGLE = "triangle",
  RECTANGLE = "rectangle",
}

export const enum ToolStatus {
  IDLE = "idle",
  DRAWING = "drawing",
}

export interface Shapes {
  arg: any;
  type: ToolNames;
}

export interface SketchData {
  drawnShapes: Shapes[];
  selectedTool: ToolNames;
  toolState: { status: ToolStatus; data: any };
}

export type Point = readonly [number, number];
export type Color = string | number[];
export type CTX = InstanceType<typeof p5>;
