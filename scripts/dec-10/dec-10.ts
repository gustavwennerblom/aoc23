import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { Coordinate, equalCoordinates } from "../../lib/matrixScanner";

const testFilePart1APath: string = path.resolve(
  `${__dirname}/test-part-1-a.txt`
);
const testFilePart1BPath: string = path.resolve(
  `${__dirname}/test-part-1-b.txt`
);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type Tile = {
  visited?: boolean;
  position: Coordinate;
  connects_to: Coordinate[];
  min_steps_to_reach: number;
};

function parseInput(input: string): { start: Coordinate; tiles: Tile[][] } {
  const rows = input.split("\n");
  const tiles: Tile[][] = [];
  let start: Coordinate = [-1, -1];
  for (const [row_index, row] of rows.entries()) {
    tiles.push([]);
    const cells = row.split("");
    for (const [cell_index, cell] of cells.entries()) {
      if (cell === ".") continue;
      if (cell === "|") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index - 1, cell_index],
            [row_index + 1, cell_index],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "-") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index, cell_index - 1],
            [row_index, cell_index + 1],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "L") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index - 1, cell_index],
            [row_index, cell_index + 1],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "J") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index - 1, cell_index],
            [row_index, cell_index - 1],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "7") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index, cell_index - 1],
            [row_index + 1, cell_index],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "F") {
        tiles[row_index][cell_index] = {
          position: [row_index, cell_index],
          connects_to: [
            [row_index, cell_index + 1],
            [row_index + 1, cell_index],
          ],
          min_steps_to_reach: Number.MAX_SAFE_INTEGER,
        };
      }
      if (cell === "S") start = [row_index, cell_index];
    }
  }
  return { start, tiles };
}

function resolveStartConnections(start: Coordinate, tiles: Tile[][]): Tile[][] {
  tiles[start[0]][start[1]] = {
    connects_to: [],
    position: start,
    min_steps_to_reach: Number.MAX_SAFE_INTEGER,
  };
  const adjacentCoords: Coordinate[] = [
    [start[0] - 1, start[1]],
    [start[0] + 1, start[1]],
    [start[0], start[1] - 1],
    [start[0], start[1] + 1],
  ];
  for (const c of adjacentCoords) {
    if (tiles[c[0]][c[1]] === undefined) continue;
    tiles[start[0]][start[1]].connects_to.push(c);
  }
  return tiles;
}

function traverseTiles(
  startTilePos: Coordinate,
  tiles: Tile[][],
  connection_idx: number
): number {
  const startTile = tiles[startTilePos[0]][startTilePos[1]];
  let currentTile = startTile;
  currentTile.visited = true;
  let nextTilePos: Coordinate | undefined =
    currentTile.connects_to[connection_idx];
  currentTile = tiles[nextTilePos[0]][nextTilePos[1]];
  let steps = 1;
  while (nextTilePos !== undefined) {
    currentTile.visited = true;
    currentTile.min_steps_to_reach = Math.min(
      currentTile.min_steps_to_reach,
      steps
    );
    const adjacentCoords = currentTile.connects_to;
    const adjacentTiles = adjacentCoords.map((c) => tiles[c[0]][c[1]]);
    nextTilePos = adjacentTiles.find((t) => !t.visited)?.position;
    if (nextTilePos === undefined) break;
    currentTile = tiles[nextTilePos[0]][nextTilePos[1]];
    steps++;
  }
  return steps;
}

function resetVisited(tiles: Tile[][]): Tile[][] {
  for (const row of tiles) {
    for (const tile of row) {
      if (tile === undefined) continue;
      tile.visited = false;
    }
  }
  return tiles;
}

function findFurthestTile(tiles: Tile[][]): number {
  const steps_arr_2d = tiles.map((row) => row.map((t) => t.min_steps_to_reach));
  let steps_arr_1d = steps_arr_2d
    .flat()
    .filter((s) => s !== Number.MAX_SAFE_INTEGER)
    .filter((s) => s !== undefined);
  steps_arr_1d.sort((a, b) => a - b);
  return steps_arr_1d[steps_arr_1d.length - 1];
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const { start, tiles: tilesWithoutStart } = parseInput(input);
  const tiles = resolveStartConnections(start, tilesWithoutStart);
  traverseTiles(start, tiles, 0);
  resetVisited(tiles);
  traverseTiles(start, tiles, 1);
  const steps = findFurthestTile(tiles);
  write(`Part 1: ${steps} steps`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
}

const start = Date.now();
solvePart1(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
