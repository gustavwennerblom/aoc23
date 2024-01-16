import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { transpose } from "../../lib/matrixScanner";
import {
  MatrixNode,
  findNodeByValue,
  getEasternNode,
  getWesternNode,
  getNorthernNode,
  getSouthernNode,
} from "../../lib/nodeMatrix2d";
import { sumArray } from "../../lib/mathStuff";
import { get } from "http";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(input: string) {
  const lines = input.split("\n");
  const points = lines.map((line) => line.split(""));
  return points;
}

function insertRowsIfAllDots(inp: string[][]) {
  const outp = structuredClone(inp);
  let height = outp.length;
  const width = outp[0].length;
  for (let y = 0; y < height; y++) {
    if (outp[y].every((p) => p === ".")) {
      outp.splice(y, 0, Array(width).fill("."));
      height++;
      y++;
    }
  }
  return outp;
}

function getRowIdxWithAllDots(inp: string[][]) {
  const ret = [];
  let height = inp.length;
  const width = inp[0].length;
  for (let y = 0; y < height; y++) {
    if (inp[y].every((p) => p === ".")) {
      ret.push(y);
    }
  }
  return ret;
}

function getColIdxWithAllDots(inp: string[][]) {
  const matrix = transpose(structuredClone(inp));
  const ret = getRowIdxWithAllDots(matrix);
  return ret;
}

function expandUniverse(_in_uni: string[][]): string[][] {
  const out_uni_temp_1 = structuredClone(_in_uni);
  // expand vertically
  const out_uni_temp_2 = insertRowsIfAllDots(out_uni_temp_1);
  // expand horizontally
  const out_uni_temp_3 = transpose(out_uni_temp_2);
  const out_uni_temp_4 = insertRowsIfAllDots(out_uni_temp_3);
  const out_uni = transpose(out_uni_temp_4);
  // return
  return out_uni;
}

function nodifyGalaxies(universe: string[][]): [MatrixNode[][], number] {
  const nodeUniverse: Array<Array<MatrixNode>> = [];
  let counter = 1;
  for (const [rowIdx, row] of universe.entries()) {
    nodeUniverse.push([]);
    for (const [nodeIdx, nodeVal] of row.entries()) {
      if (nodeVal === "#") {
        nodeUniverse[rowIdx][nodeIdx] = new MatrixNode(
          nodeIdx,
          rowIdx,
          counter.toString()
        );
        counter++;
      } else {
        nodeUniverse[rowIdx][nodeIdx] = new MatrixNode(
          nodeIdx,
          rowIdx,
          nodeVal
        );
      }
    }
  }
  return [nodeUniverse, counter - 1];
}

type GalaxyPair = {
  origin: string;
  destination: string;
};

function getPairs(maxIndex: number): GalaxyPair[] {
  const pairs: GalaxyPair[] = [];
  for (let origin = 1; origin <= maxIndex; origin++) {
    for (let destination = origin; destination <= maxIndex; destination++) {
      if (origin === destination) continue;
      pairs.push({
        origin: origin.toString(),
        destination: destination.toString(),
      });
    }
  }
  return pairs;
}

function findShortestPath(
  _nodeUniverse: MatrixNode[][],
  pair: GalaxyPair,
  {
    xVals,
    yVals,
    expansion,
  }: { xVals: number[]; yVals: number[]; expansion: number }
) {
  const nodeUniverse = structuredClone(_nodeUniverse);
  const { origin, destination } = pair;
  const startNode = findNodeByValue(nodeUniverse, origin);
  const queue: MatrixNode[] = [startNode];
  while (true) {
    const currNode = queue.shift() as MatrixNode;
    if (currNode.visited) continue;
    currNode.visited = true;
    const xAdjacentNodes = [
      getEasternNode(nodeUniverse, currNode),
      getWesternNode(nodeUniverse, currNode),
    ];
    const yAdjacentNodes = [
      getNorthernNode(nodeUniverse, currNode),
      getSouthernNode(nodeUniverse, currNode),
    ];
    for (const xNode of xAdjacentNodes) {
      if (!xNode || xNode.visited) continue;
      const steps = xVals.includes(xNode.x)
        ? currNode.stepsToReach + expansion + 1
        : currNode.stepsToReach + 1;

      if (xNode.value === destination) {
        return steps;
      }
      xNode.stepsToReach = steps;
      queue.push(xNode);
    }
    for (const yNode of yAdjacentNodes) {
      if (!yNode || yNode.visited) continue;
      const steps = yVals.includes(yNode.y)
        ? currNode.stepsToReach + expansion + 1
        : currNode.stepsToReach + 1;

      if (yNode.value === destination) {
        return steps;
      }
      yNode.stepsToReach = steps;
      queue.push(yNode);
    }
  }
}

function solvePart1(file_path: string) {
  write(`Solving part 1...`);
  const input = readFile(file_path);
  const _universe = parseInput(input);
  const rowsWithAllDots = getRowIdxWithAllDots(_universe);
  const colsWithAllDots = getColIdxWithAllDots(_universe);
  const [nodeUniverse, maxNodeValue] = nodifyGalaxies(_universe);
  const galaxyPairs = getPairs(maxNodeValue);
  const shortestPaths = galaxyPairs.map((pair, idx) => {
    const sp = findShortestPath(nodeUniverse, pair, {
      xVals: colsWithAllDots,
      yVals: rowsWithAllDots,
      expansion: 1,
    });
    console.log(
      `Finding shortest path for ${pair.origin} -> ${pair.destination} (${
        idx + 1
      }/${galaxyPairs.length}) :: ${sp} steps`
    );
    return sp;
  });
  const shortestPathsSum = sumArray(shortestPaths);
  write(`Shortest paths sum: ${shortestPathsSum}`);
}

function solvePart2(file_path: string) {
  write(`Solving part 2...`);
  const input = readFile(file_path);
  const _universe = parseInput(input);
  const rowsWithAllDots = getRowIdxWithAllDots(_universe);
  const colsWithAllDots = getColIdxWithAllDots(_universe);
  const [nodeUniverse, maxNodeValue] = nodifyGalaxies(_universe);
  const galaxyPairs = getPairs(maxNodeValue);
  const shortestPaths = galaxyPairs.map((pair, idx) => {
    const sp = findShortestPath(nodeUniverse, pair, {
      xVals: colsWithAllDots,
      yVals: rowsWithAllDots,
      expansion: 1000000 - 1,
    });
    console.log(
      `Finding shortest path for ${pair.origin} -> ${pair.destination} (${
        idx + 1
      }/${galaxyPairs.length}) :: ${sp} steps`
    );
    return sp;
  });
  const shortestPathsSum = sumArray(shortestPaths);
  write(`Shortest paths sum: ${shortestPathsSum}`);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
