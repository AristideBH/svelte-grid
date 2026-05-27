import type { GridItem, BreakpointItem, ColsDefinition } from "../types.js";
import { makeMatrix, makeMatrixFromItems, makeMatrixFromItemsIgnore, findCloseBlocks, findItemsById } from "./matrix.js";
import { getRowsCount } from "./other.js";

export function compactY(items: GridItem[], col: number): GridItem[] {
  let matrix = makeMatrix(getRowsCount(items, col), col);

  const order = items.toSorted((a, b) => {
    const ay = a[col]?.y ?? 0, by = b[col]?.y ?? 0;
    return ay !== by ? ay - by : (a[col]?.x ?? 0) - (b[col]?.x ?? 0);
  });

  return order.reduce<GridItem[]>((acc, item) => {
    const bp = item[col];
    if (!bp || bp.fixed || bp.static) return [...acc, item];
    const position = findFreeSpaceForItem(matrix, bp);
    const newItem: GridItem = { ...item, [col]: { ...bp, ...position } };
    acc.push(newItem);
    matrix = makeMatrixFromItems(acc, getRowsCount(acc, col), col);
    return acc;
  }, []);
}

export function getItemById(id: string, items: GridItem[]): GridItem | undefined {
  return items.find((value) => value.id === id);
}

export function findFreeSpaceForItem(matrix: (BreakpointItem | undefined)[][], item: BreakpointItem): { x: number; y: number } {
  const cols = matrix[0]?.length ?? 0;
  const w = Math.min(cols, item.w);
  const xNtime = cols - w;
  const rows = matrix.length;

  for (let i = 0; i < rows; i++) {
    const row = matrix[i];
    for (let j = 0; j <= xNtime; j++) {
      const sliceA = row.slice(j, j + w);
      if (sliceA.every((val) => val === undefined)) {
        const isEmpty = matrix.slice(i, i + item.h).every((r) => r.slice(j, j + w).every((n) => n === undefined));
        if (isEmpty) return { y: i, x: j };
      }
    }
  }

  return { y: rows, x: 0 };
}

const extractItem = (item: GridItem, col: number): BreakpointItem & { id: string } => ({
  ...(item[col] as BreakpointItem),
  id: item.id,
});

const updateItem = (elements: GridItem[], active: GridItem, position: Partial<BreakpointItem>, col: number): GridItem[] =>
  elements.map((value) =>
    value.id === active.id
      ? { ...value, [col]: { ...value[col], ...position } as BreakpointItem }
      : value,
  );

export function moveItemsAroundItem(active: GridItem, items: GridItem[], cols: number, _original: GridItem | undefined): GridItem[] {
  const activeItem = extractItem(active, cols);
  const ids = items.map((v) => v.id).filter((id) => id !== activeItem.id);
  const els = items.filter((v) => v.id !== activeItem.id);

  let newItems = updateItem(items, active, activeItem, cols);
  let matrix = makeMatrixFromItemsIgnore(newItems, ids, getRowsCount(newItems, cols), cols);
  let tempItems = newItems;
  const exclude: string[] = [];

  els.forEach((item) => {
    const bp = item[cols];
    if (!bp) return;
    const position = findFreeSpaceForItem(matrix, bp);
    exclude.push(item.id);
    tempItems = updateItem(tempItems, item, position, cols);
    const ignoreIds = ids.filter((id) => !exclude.includes(id));
    matrix = makeMatrixFromItemsIgnore(tempItems, ignoreIds, getRowsCount(tempItems, cols), cols);
  });

  return tempItems;
}

export function moveItem(active: GridItem, items: GridItem[], cols: number, _original: GridItem | undefined): GridItem[] {
  const item = extractItem(active, cols);

  let matrix = makeMatrixFromItemsIgnore(items, [item.id], getRowsCount(items, cols), cols);
  const closeBlocks = findCloseBlocks(items, matrix, item);
  const closeObj = findItemsById(closeBlocks, items);
  const fixed = closeObj.find((v) => v[cols]?.fixed);

  if (fixed) return items;

  items = updateItem(items, active, item, cols);
  matrix = makeMatrixFromItemsIgnore(items, closeBlocks, getRowsCount(items, cols), cols);

  let tempItems = items;
  let tempCloseBlocks = closeBlocks;
  const exclude: string[] = [];

  closeObj.forEach((closeItem) => {
    const bp = closeItem[cols];
    if (!bp) return;
    const position = findFreeSpaceForItem(matrix, bp);
    exclude.push(closeItem.id);
    tempItems = updateItem(tempItems, closeItem, position, cols);
    const ignoreIds = tempCloseBlocks.filter((id) => !exclude.includes(id));
    matrix = makeMatrixFromItemsIgnore(tempItems, ignoreIds, getRowsCount(tempItems, cols), cols);
  });

  return tempItems;
}

export function normalize(items: GridItem[], col: number): GridItem[] {
  let result = items.slice();

  result.forEach((value) => {
    const bp = value[col];
    if (bp && !bp.static) {
      result = moveItem(value, result, col, value);
    }
  });

  return result;
}

export function adjust(items: GridItem[], col: number): GridItem[] {
  let matrix = makeMatrix(getRowsCount(items, col), col);

  const order = items.toSorted((a, b) => {
    const aItem = a[col];
    const bItem = b[col];
    return (aItem?.x ?? 0) - (bItem?.x ?? 0) || (aItem?.y ?? 0) - (bItem?.y ?? 0);
  });

  return order.reduce<GridItem[]>((acc, item) => {
    const bp = item[col];
    if (!bp) return [...acc, item];
    const position = findFreeSpaceForItem(matrix, bp);
    const newItem: GridItem = { ...item, [col]: { ...bp, ...position } };
    acc.push(newItem);
    matrix = makeMatrixFromItems(acc, getRowsCount(acc, col), col);
    return acc;
  }, []);
}

export function getUndefinedItems(items: GridItem[], col: number): string[] {
  return items.flatMap((value) => (!value[col] ? [value.id] : []));
}

export function getClosestColumn(items: GridItem[], item: GridItem, col: number, breakpoints: ColsDefinition): number {
  const defined = breakpoints
    .map(([, column]) => (item[column] ? column : null))
    .filter((c): c is number => c !== null);

  return defined.reduce((acc, value) => {
    return Math.abs(value - col) < Math.abs(acc - col) ? value : acc;
  });
}

export function specifyUndefinedColumns(items: GridItem[], col: number, breakpoints: ColsDefinition): GridItem[] {
  let matrix = makeMatrixFromItems(items, getRowsCount(items, col), col);
  const undefinedIds = getUndefinedItems(items, col);
  let newItems = [...items];

  undefinedIds.forEach((elementId) => {
    const element = items.find((item) => item.id === elementId);
    if (!element) return;

    const closestColumn = getClosestColumn(items, element, col, breakpoints);
    const closestBp = element[closestColumn];
    if (!closestBp) return;

    const position = findFreeSpaceForItem(matrix, closestBp);
    const newItem: GridItem = { ...element, [col]: { ...closestBp, ...position } };
    newItems = newItems.map((v) => (v.id === elementId ? newItem : v));
    matrix = makeMatrixFromItems(newItems, getRowsCount(newItems, col), col);
  });

  return newItems;
}
