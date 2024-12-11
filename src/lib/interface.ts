export const enum ToolNames {
  PEN = "pen",
  LINE = "line",
  TEXT = "text",
  SELECT = "select",
  SPLINE = "spline",
  ELLIPSE = "ellipse",
  POLYGON = "polygon",
  TRIANGLE = "triangle",
  RECTANGLE = "rectangle",
}

export interface SketchData {
  selectedTool: ToolNames;
}
