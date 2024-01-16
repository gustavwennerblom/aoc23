export type Coordinate = [lineNo: number, linePos: number];

export function scanNorth(
  coordsIn: Coordinate[],
  matrix: string[][],
  includeCorners = false
) {
  // Add the corners if requested
  const coords = structuredClone(coordsIn);
  if (includeCorners) {
    const firstCoord = coords[0];
    const lastCoord = coords[coords.length - 1];

    coords.push([firstCoord[0], firstCoord[1] - 1]);
    coords.push([lastCoord[0], lastCoord[1] + 1]);
  }
  const charsFound = coords.map((coord) => {
    const [lineNo, linePos] = coord;
    // Handle case where there is no line above
    if (lineNo <= 0) return null;
    // Handle case where there is no position to the right
    if (linePos >= matrix[lineNo].length - 1) return null;
    // Handle case where there is no position to the left
    if (linePos <= 0) return null;
    return matrix[lineNo - 1][linePos];
  });
  return charsFound;
}

export function scanSouth(
  coordsIn: Coordinate[],
  matrix: string[][],
  includeCorners = false
) {
  // Add the corners if requested
  const coords = structuredClone(coordsIn);
  if (includeCorners) {
    const firstCoord = coords[0];
    const lastCoord = coords[coords.length - 1];

    coords.push([firstCoord[0], firstCoord[1] - 1]);
    coords.push([lastCoord[0], lastCoord[1] + 1]);
  }
  const charsFound = coords.map((coord) => {
    const [lineNo, linePos] = coord;
    // Handle case where there is no line below
    if (lineNo >= matrix.length - 1) return null;
    // Handle case where there is no position to the right
    if (linePos >= matrix[lineNo].length - 1) return null;
    // Handle case where there is no position to the left
    if (linePos <= 0) return null;
    return matrix[lineNo + 1][linePos];
  });
  return charsFound;
}

export function scanEast(
  coordsIn: Coordinate[],
  matrix: string[][],
  includeCorners = false
) {
  // Add the corners if requested
  const coords = structuredClone(coordsIn);
  if (includeCorners) {
    const firstCoord = coords[0];
    const lastCoord = coords[coords.length - 1];

    coords.push([firstCoord[0] + 1, firstCoord[1]]);
    coords.push([lastCoord[0] + 1, lastCoord[1]]);
  }
  const charsFound = coords.map((coord) => {
    const [lineNo, linePos] = coord;
    // Handle case where there is no line below
    if (lineNo >= matrix.length - 1) return null;
    // Handle case where there is no position to the right
    if (linePos >= matrix[lineNo].length - 1) return null;
    // Handle case where there is no position to the left
    if (linePos <= 0) return null;
    return matrix[lineNo][linePos + 1];
  });
  return charsFound;
}

export function scanWest(
  coordsIn: Coordinate[],
  matrix: string[][],
  includeCorners = false
) {
  // Add the corners if requested
  const coords = structuredClone(coordsIn);
  if (includeCorners) {
    const firstCoord = coords[0];
    const lastCoord = coords[coords.length - 1];

    coords.push([firstCoord[0] + 1, firstCoord[1]]);
    coords.push([lastCoord[0] + 1, lastCoord[1]]);
  }
  const charsFound = coords.map((coord) => {
    const [lineNo, linePos] = coord;
    // Handle case where there is no line below
    if (lineNo >= matrix.length - 1) return null;
    // Handle case where there is no position to the right
    if (linePos >= matrix[lineNo].length - 1) return null;
    // Handle case where there is no position to the left
    if (linePos <= 0) return null;
    return matrix[lineNo][linePos - 1];
  });
  return charsFound;
}

/**
 * Takes a `Coordinate` and returns the coordinates of the surrounding positions
 * in a two-dimensional matrix, excluding "impossible" positions.
 * @param includeCorners If `true`, the coordinates of the corners are included
 */
export function getBoundingBox(
  coord: Coordinate,
  matrix: string[][],
  includeCorners = true
) {
  const out: Coordinate[] = [];
  const [lineNo, linePos] = coord;
  const lineEndPos = matrix[lineNo].length - 1;
  // North
  if (lineNo > 0) {
    out.push([lineNo - 1, linePos]);
  }
  // East
  if (linePos < lineEndPos) {
    out.push([lineNo, linePos + 1]);
  }
  // South
  if (lineNo < matrix.length - 1) {
    out.push([lineNo + 1, linePos]);
  }
  // West
  if (linePos > 0) {
    out.push([lineNo, linePos - 1]);
  }
  // Return the bounding box early if corners are not requested
  if (!includeCorners) return out;
  // North-East
  if (lineNo > 0 && linePos < lineEndPos) {
    out.push([lineNo - 1, linePos + 1]);
  }
  // South-East
  if (lineNo < matrix.length - 1 && linePos < lineEndPos) {
    out.push([lineNo + 1, linePos + 1]);
  }
  // South-West
  if (lineNo < matrix.length - 1 && linePos > 0) {
    out.push([lineNo + 1, linePos - 1]);
  }
  // North-West
  if (lineNo > 0 && linePos > 0) {
    out.push([lineNo - 1, linePos - 1]);
  }
  return out;
}

/**
 * Checks if two coordinates refer to the same position in a two-dimensional matrix
 */
export function equalCoordinates(
  coord1: Coordinate,
  coord2: Coordinate
): boolean {
  return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}

export function printMatrix(matrix: string[][]) {
  const lines = matrix.map((line) => line.join(""));
  console.log(lines.join("\n"));
}

export function transpose<T>(matrix: T[][]) {
  const rows = matrix.length,
    cols = matrix[0].length;
  const grid: T[][] = [];
  for (let j = 0; j < cols; j++) {
    grid[j] = Array<T>(rows);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[j][i] = matrix[i][j];
    }
  }
  return grid;
}

export function rotateMatrixClockwise(matrix: string[][]) {
  const rotatedMatrix = transpose(matrix);
  rotatedMatrix.forEach((line) => line.reverse());
  return rotatedMatrix;
}

export function rotateMatrixCounterClockwise(matrix: string[][]) {
  const unRotatedMatrix = transpose(matrix);
  unRotatedMatrix.reverse();
  return unRotatedMatrix;
}

export function padMatrixNorth(_matrix: string[][], paddingChar: string) {
  const matrix = structuredClone(_matrix);
  const lineLength = matrix[0].length;
  const paddingLine = Array(lineLength).fill(paddingChar);
  matrix.unshift(paddingLine);
  return matrix;
}

export function collapseMatrix(_matrix: string[][]) {
  const matrix = structuredClone(_matrix);
  const collapsedMatrix = matrix.map((line) => line.join("")).join("");
  return collapsedMatrix;
}
