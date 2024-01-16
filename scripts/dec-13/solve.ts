import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { printMatrix, transpose } from "../../lib/matrixScanner";
import { sumArray } from "../../lib/mathStuff";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const testFile2Path: string = path.resolve(`${__dirname}/test2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(file_path: string): string[][][] {
  const input = readFile(file_path);
  return input
    .split("\n\n")
    .map((tile) => tile.split("\n").map((row) => row.split("")));
}

function collapseMatrix(matrix: string[][]): string {
  return matrix.map((row) => row.join("")).join("");
}

function truncateToSameLength(
  a: string,
  b: string
): [string, string] | [null, null] {
  if (a.length === b.length) return [a, b];
  if (a.length > b.length) return [a.slice(0, b.length), b];
  return [a, b.slice(0, a.length)];
}

function patternMatch(charsAbove: string | null, charsBelow: string | null) {
  if (charsAbove === null || charsBelow === null) return false;
  const charsAboveArr = charsAbove.split("");
  let match = false;
  for (let i = 0; i < charsAboveArr.length; i++) {
    let permutation: string = "foo";
    if (charsAboveArr[i] === ".") {
      permutation =
        charsAboveArr.slice(0, i).join("") +
        "#" +
        charsAboveArr.slice(i + 1).join("");
    }
    if (charsAboveArr[i] === "#") {
      permutation =
        charsAboveArr.slice(0, i).join("") +
        "." +
        charsAboveArr.slice(i + 1).join("");
    }
    if (permutation === charsBelow) {
      match = true;
      break;
    }
  }
  return match;
}

function findHorizontalReflections(matrix: string[][]): number | null {
  const rowCount = matrix.length;
  for (let i = 1; i < rowCount; i++) {
    const _charsAbove = collapseMatrix(matrix.slice(0, i).reverse());
    const _charsBelow = collapseMatrix(matrix.slice(i));
    const [charsAbove, charsBelow] = truncateToSameLength(
      _charsAbove,
      _charsBelow
    );
    if (charsAbove === charsBelow) {
      return i;
    }
  }
  return null;
}

function findVerticalReflections(matrix: string[][]): number | null {
  const trpMatrix = transpose(structuredClone(matrix));
  return findHorizontalReflections(trpMatrix);
}

function findHorizontalReflectionsWithSmudges(
  matrix: string[][]
): number | null {
  const rowCount = matrix.length;
  for (let i = 1; i < rowCount; i++) {
    const _charsAbove = collapseMatrix(matrix.slice(0, i).reverse());
    const _charsBelow = collapseMatrix(matrix.slice(i));
    const [charsAbove, charsBelow] = truncateToSameLength(
      _charsAbove,
      _charsBelow
    );
    if (patternMatch(charsAbove, charsBelow)) {
      return i;
    }
  }
  return null;
}

function findVerticalReflectionsWithSmudges(matrix: string[][]): number | null {
  const trpMatrix = transpose(structuredClone(matrix));
  return findHorizontalReflectionsWithSmudges(trpMatrix);
}

function solvePart1(file_path: string) {
  const matrices = parseInput(file_path);
  const columnsLeftOfVerticalReflections = matrices.map((matrix) =>
    Number(findVerticalReflections(matrix))
  );
  const rowsAboveHorizontalReflections = matrices.map(
    (matrix) => Number(findHorizontalReflections(matrix)) * 100
  );
  const res =
    sumArray(columnsLeftOfVerticalReflections) +
    sumArray(rowsAboveHorizontalReflections);
  write(res);
}

function solvePart2(file_path: string) {
  const matrices = parseInput(file_path);
  const rowsAboveHorizontalReflections = matrices.map(
    (matrix) => Number(findHorizontalReflectionsWithSmudges(matrix)) * 100
  );
  const columnsLeftOfVerticalReflections = matrices.map((matrix) =>
    Number(findVerticalReflectionsWithSmudges(matrix))
  );
  const res =
    sumArray(columnsLeftOfVerticalReflections) +
    sumArray(rowsAboveHorizontalReflections);
  write(res);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
