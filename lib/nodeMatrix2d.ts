export class MatrixNode {
  x: number;
  y: number;
  value: string;
  altValue: string; // This can be used to represent a different value for the node, e.g. to visually signal a visite node. See the PrintMatrixOptions type below.
  costToReach?: number;
  visited: boolean;
  visitCount: number;
  lastVisitMeta: string;
  stepsToReach: number;

  constructor(x: number, y: number, value: string, costToReach?: number) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.visited = false;
    this.visitCount = 0;
    this.stepsToReach = 0;
    this.lastVisitMeta = "";
    this.altValue = value;
    this.costToReach = costToReach || Infinity;
  }

  toString() {
    process.stdout.write(this.value);
  }
}

type PrintMatrixOptions = {
  printAltValue: boolean;
};

export function printMatrix(
  matrix: MatrixNode[][],
  options?: PrintMatrixOptions
) {
  const printAltValue = options?.printAltValue ?? false;
  if (printAltValue) {
    for (const row of matrix) {
      console.log(row.map((node) => node.altValue).join(""));
    }
    return;
  }
  for (const row of matrix) {
    console.log(row.map((node) => node.value).join(""));
  }
}

export function findNodeByValue(
  matrix: MatrixNode[][],
  value: string
): MatrixNode {
  const height = matrix.length;
  const width = matrix[0].length;
  for (const row of matrix) {
    for (const node of row) {
      if (node.value === value) {
        return node;
      }
    }
  }
  throw Error(`Could not find node with value ${value}`);
}

export function getNorthernNode(matrix: MatrixNode[][], refNode: MatrixNode) {
  const refX = refNode.x;
  const refY = refNode.y;
  try {
    const target = matrix[refY - 1][refX];
    return target;
  } catch {
    return undefined;
  }
}

export function getSouthernNode(matrix: MatrixNode[][], refNode: MatrixNode) {
  const refX = refNode.x;
  const refY = refNode.y;
  try {
    const target = matrix[refY + 1][refX];
    return target;
  } catch {
    return undefined;
  }
}

export function getWesternNode(matrix: MatrixNode[][], refNode: MatrixNode) {
  const refX = refNode.x;
  const refY = refNode.y;
  try {
    const target = matrix[refY][refX - 1];
    return target;
  } catch {
    return undefined;
  }
}

export function getEasternNode(matrix: MatrixNode[][], refNode: MatrixNode) {
  const refX = refNode.x;
  const refY = refNode.y;
  try {
    const target = matrix[refY][refX + 1];
    return target;
  } catch {
    return undefined;
  }
}

export function getAdjacentNodes(matrix: MatrixNode[][], refNode: MatrixNode) {
  const adjacentNodes: (MatrixNode | undefined)[] = [];
  adjacentNodes.push(getNorthernNode(matrix, refNode));
  adjacentNodes.push(getSouthernNode(matrix, refNode));
  adjacentNodes.push(getEasternNode(matrix, refNode));
  adjacentNodes.push(getWesternNode(matrix, refNode));
  const adjacentNodesFiltered = adjacentNodes.filter(
    (n) => n !== undefined
  ) as MatrixNode[];
  return adjacentNodesFiltered;
}

export function padMatrix(
  _matrix: MatrixNode[][],
  paddingValue: string
): MatrixNode[][] {
  const matrix = structuredClone(_matrix);
  const height = matrix.length;
  const width = matrix[0].length;
  const paddedMatrix: MatrixNode[][] = [];
  for (let y = 0; y < height + 2; y++) {
    const row: MatrixNode[] = [];
    for (let x = 0; x < width + 2; x++) {
      if (y === 0 || y === height + 1 || x === 0 || x === width + 1) {
        row.push(new MatrixNode(x, y, paddingValue));
      } else {
        row.push(matrix[y - 1][x - 1]);
      }
    }
    paddedMatrix.push(row);
  }

  // Reindex all tiles
  const paddedHeight = paddedMatrix.length;
  const paddedWidth = paddedMatrix[0].length;
  for (let y = 0; y < paddedHeight; y++) {
    for (let x = 0; x < paddedWidth; x++) {
      const node = paddedMatrix[y][x];
      node.x = x;
      node.y = y;
    }
  }
  return paddedMatrix;
}
