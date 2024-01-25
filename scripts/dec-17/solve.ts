import path, { parse } from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import {
  MatrixNode,
  getEasternNode,
  getManhattanDistance,
  getNorthernNode,
  getSouthernNode,
  getWesternNode,
  padMatrix,
  printMatrix,
} from "../../lib/nodeMatrix2d";
import { Heap } from "heap-js";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

const parseInput = (input: string) => {
  const lines = input.split("\n");
  const matrix = lines.map((line, y) => {
    return line.split("").map((char, x) => new MatrixNode(x, y, char));
  });
  const paddedMatrix = padMatrix(matrix, "'");
  return paddedMatrix;
};

type CrucibleState = {
  position: {
    y: number;
    x: number;
  };
  heatLossIncurred: number;
  directionHistory: string[];
  priority: number;
};

type AdjacentTiles = {
  N?: MatrixNode;
  S?: MatrixNode;
  E?: MatrixNode;
  W?: MatrixNode;
};

const getAdjacentTiles = (matrix: MatrixNode[][], currentTile: MatrixNode) => {
  const northernTile = getNorthernNode(matrix, currentTile);
  const southernTile = getSouthernNode(matrix, currentTile);
  const easternTile = getEasternNode(matrix, currentTile);
  const westernTile = getWesternNode(matrix, currentTile);

  const adjacentTiles: AdjacentTiles = {};
  if (northernTile && northernTile.value !== "'") {
    adjacentTiles["N"] = northernTile;
  }
  if (southernTile && southernTile.value !== "'") {
    adjacentTiles["S"] = southernTile;
  }
  if (easternTile && easternTile.value !== "'") {
    adjacentTiles["E"] = easternTile;
  }
  if (westernTile && westernTile.value !== "'") {
    adjacentTiles["W"] = westernTile;
  }

  return adjacentTiles;
};

const getOppositeDirection = (direction: string) => {
  switch (direction) {
    case "N":
      return "S";
    case "S":
      return "N";
    case "E":
      return "W";
    case "W":
      return "E";
    default:
      return "";
  }
};

const isTarget = (tile: MatrixNode, endNodeCoords: [y: number, x: number]) => {
  return tile.y === endNodeCoords[0] && tile.x === endNodeCoords[1];
};

const moveCrucible = (
  _matrix: MatrixNode[][],
  startNodeCoords: [y: number, x: number],
  endNodeCoords: [y: number, x: number]
) => {
  const matrix = structuredClone(_matrix);

  // This comparator considers a low priority number to be a higher priority
  const comparator = (a: CrucibleState, b: CrucibleState) =>
    a.priority - b.priority;
  const priorityQueue = new Heap(comparator);

  priorityQueue.push({
    position: { y: startNodeCoords[0], x: startNodeCoords[1] },
    directionHistory: [],
    heatLossIncurred: 0,
    priority: 0,
  });
  let iter = 0;
  const solutions: CrucibleState[] = [];
  while (priorityQueue.length > 0) {
    iter++;

    const currentCrucible = priorityQueue.pop() as CrucibleState;
    const currentTile =
      matrix[currentCrucible.position.y][currentCrucible.position.x];

    if (iter % 100000 === 0) {
      console.log(
        `Iteration ${iter}, heap length ${priorityQueue.length}, currentTile ${currentTile.y}, ${currentTile.x}`
      );
    }

    const lastThreeDirections = currentCrucible.directionHistory.slice(-3);

    if (isTarget(currentTile, endNodeCoords)) {
      console.log("Found the exit!");
      solutions.push(currentCrucible);
    }

    currentTile.visited = true;
    currentTile.costToReach = currentCrucible.heatLossIncurred;

    const adjacentTiles = getAdjacentTiles(matrix, currentTile);
    for (const [direction, nextTile] of Object.entries(adjacentTiles)) {
      if (nextTile.visited) continue;
      const disallowedDirections: string[] = [];
      const lastCrucibleDirection =
        currentCrucible.directionHistory.slice(-1)[0];
      // Crucible can only move in a direction if it hasn't moved in that direction in the last three moves
      if (
        lastThreeDirections.length === 3 &&
        lastThreeDirections.every((d) => d === direction)
      ) {
        disallowedDirections.push(lastCrucibleDirection);
      }
      // Crucible cannot move in the opposite direction of the last move
      disallowedDirections.push(getOppositeDirection(lastCrucibleDirection));

      if (!disallowedDirections.includes(direction)) {
        const nextHeatLossIncurred =
          currentCrucible.heatLossIncurred + parseInt(nextTile.value);
        const newCrucible: CrucibleState = {
          position: { y: nextTile.y, x: nextTile.x },
          directionHistory: [...currentCrucible.directionHistory, direction],
          heatLossIncurred: nextHeatLossIncurred,
          priority:
            nextHeatLossIncurred +
            getManhattanDistance(
              currentTile,
              matrix[endNodeCoords[0]][endNodeCoords[1]]
            ) *
              1,
        };
        if (
          nextTile.costToReach &&
          newCrucible.heatLossIncurred <= nextTile.costToReach
        ) {
          if (solutions.length > 0 && !isTarget(nextTile, endNodeCoords)) {
            continue;
          }
          priorityQueue.push(newCrucible);
        }
      }
    }
  }
  return solutions;
};

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  const endY = matrix.length - 2;
  const endX = matrix[0].length - 2;
  write(`Part 1: Exit tile ${endY}, ${endX}`);
  const minHeatLossCrucibles = moveCrucible(matrix, [1, 1], [endY, endX]);
  const minHeatLossCrucible = minHeatLossCrucibles.sort(
    (a, b) => a.heatLossIncurred - b.heatLossIncurred
  )[0];
  write(`Part 1: Minimum heat loss ${minHeatLossCrucible?.heatLossIncurred}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
}

const start = Date.now();
solvePart1(testFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
