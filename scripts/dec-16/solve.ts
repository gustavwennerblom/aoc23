import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { MatrixNode, padMatrix, printMatrix } from "../../lib/nodeMatrix2d";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type Beam = {
  x: number;
  y: number;
  direction: "N" | "S" | "E" | "W";
};

function parseInput(input: string) {
  const lines = input.split("\n");
  const matrix = lines.map((line, y) => {
    return line.split("").map((char, x) => new MatrixNode(x, y, char));
  });
  const paddedMatrix = padMatrix(matrix, "*");
  return paddedMatrix;
}

type Direction = "N" | "E" | "S" | "W";
const directions: Direction[] = ["N", "E", "S", "W"];

function getNextBeamDirection(tile: MatrixNode, beam: Beam): Direction[] {
  const { x, y } = tile;
  const beamDirectionIndex = directions.indexOf(beam.direction);
  let nextBeams: Beam[] = [];
  switch (tile.value) {
    case ".": {
      return [beam.direction];
    }
    case "/": {
      if (beam.direction === "N" || beam.direction === "S") {
        return [directions[(beamDirectionIndex + 1) % 4]];
      } else {
        return [directions[(beamDirectionIndex + 3) % 4]];
      }
    }
    case "\\": {
      if (beam.direction === "N" || beam.direction === "S") {
        return [directions[(beamDirectionIndex + 3) % 4]];
      } else {
        return [directions[(beamDirectionIndex + 1) % 4]];
      }
    }
    case "|": {
      if (beam.direction === "N" || beam.direction === "S") {
        return [beam.direction];
      } else {
        return [
          directions[(beamDirectionIndex + 1) % 4],
          directions[(beamDirectionIndex + 3) % 4],
        ];
      }
    }
    case "-": {
      if (beam.direction === "N" || beam.direction === "S") {
        return [
          directions[(beamDirectionIndex + 1) % 4],
          directions[(beamDirectionIndex + 3) % 4],
        ];
      } else {
        return [beam.direction];
      }
    }
    default: {
      throw Error(`Invalid tile value: ${tile.value}`);
    }
  }
}

function getNextBeams(tile: MatrixNode, beam: Beam): Beam[] {
  const { x, y, value } = tile;
  const directions = getNextBeamDirection(tile, beam);
  const nextBeams: Beam[] = [];
  for (const direction of directions) {
    switch (direction) {
      case "N": {
        nextBeams.push({ x: x, y: y - 1, direction: direction });
        break;
      }
      case "E": {
        nextBeams.push({ x: x + 1, y: y, direction: direction });
        break;
      }
      case "S": {
        nextBeams.push({ x: x, y: y + 1, direction: direction });
        break;
      }
      case "W": {
        nextBeams.push({ x: x - 1, y: y, direction: direction });
        break;
      }
    }
  }
  return nextBeams;
}

function shineBeam(_matrix: MatrixNode[][], _startBeam: Beam) {
  const matrix = structuredClone(_matrix);
  let iter = 0;
  const beamQueue: Beam[] = [_startBeam];
  const beamsSeen = new Set<string>();
  while (beamQueue.length > 0) {
    const beam = beamQueue.shift();
    if (!beam) {
      throw Error("Beam queue is empty");
    }
    const currTile = matrix[beam.y][beam.x];
    if (currTile.value === "*") {
      continue;
    }
    currTile.visited = true;
    currTile.visitCount++;
    currTile.altValue = "#";
    currTile.lastVisitMeta = beam.direction;
    const nextBeams = getNextBeams(matrix[beam.y][beam.x], beam).filter((b) => {
      const beamKey = `${b.x},${b.y},${b.direction}`;
      if (beamsSeen.has(beamKey)) {
        return false;
      }
      beamsSeen.add(beamKey);
      return true;
    });
    iter++;
    beamQueue.push(...nextBeams);
    // console.log(`\nIteration ${iter}: Queue length: ${beamQueue.length}`);
    // printMatrix(matrix, { printAltValue: true });
  }
  return matrix;
}

function countEnergized(matrix: MatrixNode[][]) {
  let count = 0;
  for (const row of matrix) {
    for (const node of row) {
      if (node.visitCount > 0) {
        count++;
      }
    }
  }
  return count;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  const beam: Beam = { x: 1, y: 1, direction: "E" };
  const litMatrix = shineBeam(matrix, beam);
  const tilesEnergized = countEnergized(litMatrix);
  write(`Part 1 - Energized tiles: ${tilesEnergized}`);
  // 6110 not correct (no guidance given)
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  const startBeams: Beam[] = [];
  // Add startBeams from left and right
  for (let y = 1; y < matrix.length - 1; y++) {
    startBeams.push({ x: 1, y: y, direction: "E" });
    startBeams.push({ x: matrix[0].length - 2, y: y, direction: "W" });
  }
  // Add startBeams from top and botton
  for (let x = 1; x < matrix[0].length - 1; x++) {
    startBeams.push({ x: x, y: 1, direction: "S" });
    startBeams.push({ x: x, y: matrix.length - 2, direction: "N" });
  }
  const energizedTilesCount = startBeams.map((beam) => {
    const litMatrix = shineBeam(matrix, beam);
    return countEnergized(litMatrix);
  });
  const maxEnergizedTilesCount = Math.max(...energizedTilesCount);
  write(`Part 2 - Max energized tiles: ${maxEnergizedTilesCount}`);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
