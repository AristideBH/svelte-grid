import type { GridItem, BreakpointItem } from "../types.js";

type MatrixCell = (BreakpointItem & { id: string }) | undefined;
type Matrix = MatrixCell[][];

export function makeMatrix(rows: number, cols: number): Matrix {
  return Array.from(Array(rows), () => new Array(cols));
}

export function makeMatrixFromItems(items: GridItem[], rows: number, cols: number): Matrix {
  const matrix = makeMatrix(rows, cols);

  for (let i = 0; i < items.length; i++) {
    const value = items[i][cols];
    if (value) {
      const { x, y, h } = value;
      const id = items[i].id;
      const w = Math.min(cols, value.w);

      for (let j = y; j < y + h; j++) {
        const row = matrix[j];
        if (row) {
          for (let k = x; k < x + w; k++) {
            row[k] = { ...value, id };
          }
        }
      }
    }
  }

  return matrix;
}

export function makeMatrixFromItemsIgnore(items: GridItem[], ignoreList: string[], rows: number, cols: number): Matrix {
  const matrix = makeMatrix(rows, cols);

  for (let i = 0; i < items.length; i++) {
    const value = items[i][cols];
    const id = items[i].id;

    if (!value || ignoreList.includes(id)) continue;

    const { x, y, h } = value;
    const w = Math.min(cols, value.w);

    for (let j = y; j < y + h; j++) {
      const row = matrix[j];
      if (row) {
        for (let k = x; k < x + w; k++) {
          row[k] = { ...value, id };
        }
      }
    }
  }

  return matrix;
}

export function findCloseBlocks(items: GridItem[], matrix: Matrix, curObject: BreakpointItem & { id: string }): string[] {
  const { h, x, y } = curObject;
  const w = Math.min(matrix[0]?.length ?? 0, curObject.w);
  const tempR = matrix.slice(y, y + h);

  const result: string[] = [];
  for (let i = 0; i < tempR.length; i++) {
    const tempA = tempR[i].slice(x, x + w);
    for (const val of tempA) {
      if (val?.id && val.id !== curObject.id) {
        result.push(val.id);
      }
    }
  }

  return [...new Set(result)];
}

export function findItemsById(ids: string[], items: GridItem[]): GridItem[] {
  return items.filter((value) => ids.includes(value.id));
}
