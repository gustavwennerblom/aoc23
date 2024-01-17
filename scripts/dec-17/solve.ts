import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import {
  MatrixNode,
  getEasternNode,
  getNorthernNode,
  getSouthernNode,
  getWesternNode,
  padMatrix,
  printMatrix,
} from "../../lib/nodeMatrix2d";

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
  if (northernTile && northernTile.value !== "'" && !northernTile.visited) {
    adjacentTiles["N"] = northernTile;
  }
  if (southernTile && southernTile.value !== "'" && !southernTile.visited) {
    adjacentTiles["S"] = southernTile;
  }
  if (easternTile && easternTile.value !== "'" && !easternTile.visited) {
    adjacentTiles["E"] = easternTile;
  }
  if (westernTile && westernTile.value !== "'" && !westernTile.visited) {
    adjacentTiles["W"] = westernTile;
  }

  return adjacentTiles;
};

const moveCrucible = (
  _matrix: MatrixNode[][],
  startNodeCoords: [y: number, x: number]
) => {
  const matrix = structuredClone(_matrix);
  const queue: CrucibleState[] = [];
  queue.push({
    position: { y: startNodeCoords[0], x: startNodeCoords[1] },
    directionHistory: [],
    heatLossIncurred: 0,
  });
  while (queue.length > 0) {
    const currentCrucible = queue.shift() as CrucibleState;
    const currentTile =
      matrix[currentCrucible.position.y][currentCrucible.position.x];
    const lastThreeDirections = currentCrucible.directionHistory.slice(-3);

    currentTile.visited = true;
    currentTile.costToReach = Math.min(
      currentTile.costToReach || Infinity,
      currentCrucible.heatLossIncurred
    );

    const adjacentTiles = getAdjacentTiles(matrix, currentTile);
    for (const [direction, tile] of Object.entries(adjacentTiles)) {
      const disallowedDirections: string[] = [];
      // Crucible can only move in a direction if it hasn't moved in that direction in the last three moves
      if (
        lastThreeDirections.length === 3 &&
        lastThreeDirections.every((d) => d === direction)
      ) {
        disallowedDirections.push(lastThreeDirections[0]);
      }
      // Crucible cannot move in the opposite direction of the last move
      disallowedDirections.push(
        lastThreeDirections[lastThreeDirections.length - 1]
      );

      if (!disallowedDirections.includes(direction)) {
        const newCrucible: CrucibleState = {
          position: { y: tile.y, x: tile.x },
          directionHistory: [...currentCrucible.directionHistory, direction],
          heatLossIncurred:
            currentCrucible.heatLossIncurred + parseInt(currentTile.value),
        };
        queue.push(newCrucible);
      }
    }
  }
  return matrix;
};

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const matrix = parseInput(input);
  const travelledMatrix = moveCrucible(matrix, [1, 1]);
  const arrivalTile =
    travelledMatrix[travelledMatrix.length - 2][travelledMatrix[0].length - 2];
  write(`Part 1: Minimum heat loss ${arrivalTile.costToReach}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
}

const start = Date.now();
solvePart1(testFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
