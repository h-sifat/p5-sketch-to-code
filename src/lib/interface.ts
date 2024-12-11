import type p5 from "p5";
import { ShapeStore } from "./states.svelte";

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

export const enum Commands {
  UNDO = "undo",
  REDO = "redo",
}

export interface Shapes {
  arg: any;
  type: ToolNames;
}

export interface SketchData {
  maximize: boolean;
  drawnShapes: ShapeStore;
  selectedTool: ToolNames;
  canvasSize: [number, number];
  containerSize: [number, number];
  toolState: { status: ToolStatus; data: any };
}

export type Point = readonly [number, number];
export type Color = string | number[];
export type CTX = InstanceType<typeof p5>;
