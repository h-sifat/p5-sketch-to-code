import { ToolNames, ToolStatus, type SketchData } from "./interface";

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
