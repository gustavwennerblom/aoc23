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

const serializeMove = (tile: MatrixNode, direction: string[]) =>
  `${tile.y},${tile.x},${direction}`;

const crucibleMovesSeen = new Set<string>();

const getBannedDirections = (crucible: CrucibleState) => {
  const bannedDirections: string[] = [];
  const lastThreeDirections = crucible.directionHistory.slice(-3);
  const lastDirection = crucible.directionHistory.slice(-1)[0];

  // Crucible cannot move in the same direction more than three consecutive times
  if (
    lastThreeDirections.length === 3 &&
    lastThreeDirections.every((d) => d === lastDirection)
  ) {
    bannedDirections.push(lastDirection);
  }

  // Crucible cannot move in the opposite direction of the last move
  bannedDirections.push(getOppositeDirection(lastDirection));

  return bannedDirections;
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
  while (priorityQueue.length > 0) {
    iter++;
    const currentCrucible = priorityQueue.pop() as CrucibleState;
    const currentTile =
      matrix[currentCrucible.position.y][currentCrucible.position.x];

    if (isTarget(currentTile, endNodeCoords)) {
      console.log("Found the exit!");
      return currentCrucible;
    }

    const adjacentTiles = getAdjacentTiles(matrix, currentTile);
    for (const [direction, nextTile] of Object.entries(adjacentTiles)) {
      const bannedDirections = getBannedDirections(currentCrucible);
      if (!bannedDirections.includes(direction)) {
        const lastThreeDirections = currentCrucible.directionHistory.slice(-3);
        if (
          crucibleMovesSeen.has(
            serializeMove(currentTile, [...lastThreeDirections, direction])
          )
        ) {
          continue;
        }
        const nextHeatLossIncurred =
          currentCrucible.heatLossIncurred + parseInt(nextTile.value);

        const distanceToTarget = getManhattanDistance(
          nextTile,
          matrix[endNodeCoords[0]][endNodeCoords[1]]
        );

        const newCrucible: CrucibleState = {
          position: { y: nextTile.y, x: nextTile.x },
          directionHistory: [...currentCrucible.directionHistory, direction],
          heatLossIncurred: nextHeatLossIncurred,
          priority: nextHeatLossIncurred + distanceToTarget,
        };

        crucibleMovesSeen.add(
          serializeMove(currentTile, [...lastThreeDirections, direction])
        );
        priorityQueue.push(newCrucible);
      }
    }
  }
};

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  const endY = matrix.length - 2;
  const endX = matrix[0].length - 2;
  write(`Part 1: Exit tile ${endY}, ${endX}`);
  const minHeatLossCrucible = moveCrucible(matrix, [1, 1], [endY, endX]);
  write(`Part 1: Minimum heat loss ${minHeatLossCrucible?.heatLossIncurred}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
}

const start = Date.now();
solvePart1(inputFilePath);
// 698 (too high)
const end = Date.now();
write(`Execution time: ${end - start} ms`);
