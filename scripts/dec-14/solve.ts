import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import {
  printMatrix,
  rotateMatrixClockwise,
  rotateMatrixCounterClockwise,
  padMatrixNorth,
  collapseMatrix,
} from "../../lib/matrixScanner";
import { sumArray } from "../../lib/mathStuff";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(input: string): string[][] {
  const rows = input.split("\n");
  const matrix = rows.map((row) => row.split(""));
  return matrix;
}

function addGravityFromNorth(
  _matrix: string[][],
  movableValue: string,
  fixedValue: string
) {
  const matrix = structuredClone(_matrix);
  // pad the matrix to make it easier to find the end
  const paddedMatrix = padMatrixNorth(matrix, fixedValue);
  // rotate the matrix - applying gravity from the "North", now is the same as applying gravity from the "East"
  const rMatrix = rotateMatrixClockwise(paddedMatrix);
  for (const row of rMatrix) {
    const movablesIdxs = [];
    for (const [itemIdx, item] of row.entries()) {
      if (item === movableValue) {
        movablesIdxs.push(itemIdx);
      }
      if (item === fixedValue || itemIdx === row.length - 1) {
        // if there are no movables to the left of the fixed item, continue
        if (movablesIdxs.length === 0) continue;
        // replace all movables with a void marker
        for (const idx of movablesIdxs) {
          row[idx] = ".";
        }
        // move all movables to the left of the fixed item
        let moved = 0;
        while (movablesIdxs.length > 0) {
          const fromIdx = movablesIdxs.pop();
          if (fromIdx === undefined) {
            throw "fromIdx is undefined";
          }
          moved++;
          const toIdx = itemIdx - moved;
          row[toIdx] = movableValue;
        }
      }
    }
  }
  // Remember to unrotate and unpad before returning the result
  const retMatrix = rotateMatrixCounterClockwise(rMatrix).slice(1);
  return retMatrix;
}

function calculateLoad(matrix: string[][]) {
  const rMatrix = rotateMatrixClockwise(matrix);
  let load = 0;
  for (const row of rMatrix) {
    for (const [itemIdx, item] of row.entries()) {
      if (item === "O") {
        load += itemIdx + 1;
      }
    }
  }
  return load;
}

function cycleMatrix(_matrix: string[][]) {
  let matrix = structuredClone(_matrix);
  for (let i = 0; i < 4; i++) {
    matrix = addGravityFromNorth(matrix, "O", "#");
    matrix = rotateMatrixClockwise(matrix);
  }
  return matrix;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  printMatrix(matrix);
  console.log("====================================");
  const northShiftedMatrix = addGravityFromNorth(matrix, "O", "#");
  printMatrix(northShiftedMatrix);
  const load = calculateLoad(northShiftedMatrix);
  write(`Part 1) Total load: ${load}`);
}

function solvePart2(file_path: string) {
  const matricesSeen = new Set();
  const input = readFile(file_path);
  let matrix = parseInput(input);

  // Compute the cycle time
  let cycleTimes: number[] = [];
  matricesSeen.add(collapseMatrix(matrix));
  for (let i = 0; i < 1000; i++) {
    matrix = cycleMatrix(matrix);
    if (matricesSeen.has(collapseMatrix(matrix))) {
      console.log(`Cycle ${i + 1} is a repeat`);
      const nextCycleTime = i - sumArray(cycleTimes);
      if (nextCycleTime === cycleTimes[cycleTimes.length - 1] && i > 999) {
        // Some dark magic here with the 999
        break;
      } else {
        cycleTimes.push(nextCycleTime);
      }
      matricesSeen.clear();
    }
    matricesSeen.add(collapseMatrix(matrix));
  }

  // Compute the final matrix
  for (let i = 0; i < cycleTimes[cycleTimes.length - 1]; i++) {
    matrix = cycleMatrix(matrix);
  }

  // Compute the load
  const load = calculateLoad(matrix);
  write(`Part 2) Total load: ${load}`);
  // 83482: too low
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
