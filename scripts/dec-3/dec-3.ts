import path from "path";
import { readFile, readFileAsMatrix } from "../../lib/reader";
import {
  Coordinate,
  equalCoordinates,
  getBoundingBox,
  scanEast,
  scanNorth,
  scanSouth,
  scanWest,
} from "../../lib/matrixScanner";
import { write } from "../../lib/writer";

const testFilePath: string = path.resolve(`${__dirname}/test-part-1.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type PartNo = {
  no: number;
  coords: Coordinate;
};

function getParts(input: string, partIdRegex?: RegExp): Array<PartNo> {
  const partRegex = partIdRegex || /\d+/g;
  const foundParts: Array<PartNo> = [];
  for (const [lineNo, lineVal] of input.split("\n").entries()) {
    const matches = lineVal.matchAll(partRegex);
    for (const match of matches) {
      if (!match || match.index === undefined)
        throw new Error("No match found");
      foundParts.push({
        no: parseInt(match[0]),
        coords: [lineNo, match.index],
      });
    }
  }
  return foundParts;
}

function scanBoundingBox(part: PartNo, matrix: string[][]) {
  let lineNo = part.coords[0];
  let linePosStart = part.coords[1];
  let linePosEnd = part.coords[1] + part.no.toString().length;

  const partNoCoordinates: Coordinate[] = [];
  for (let pos = linePosStart; pos < linePosEnd; pos++) {
    partNoCoordinates.push([lineNo, pos]);
  }
  const charsFoundSouth = scanSouth(partNoCoordinates, matrix, true);
  const charsFoundNorth = scanNorth(partNoCoordinates, matrix, true);
  const charsFoundEast = scanEast(partNoCoordinates, matrix, true);
  const charsFoundWest = scanWest(partNoCoordinates, matrix, true);
  const uniqueCharsFound = new Set(
    [
      ...charsFoundSouth,
      ...charsFoundNorth,
      ...charsFoundEast,
      ...charsFoundWest,
    ].filter((c) => c !== null)
  );
  return uniqueCharsFound;
}

function expandPartCoordinates(part: PartNo): Coordinate[] {
  const partNoCoordinates: Coordinate[] = [];
  for (
    let pos = part.coords[1];
    pos < part.coords[1] + part.no.toString().length;
    pos++
  ) {
    partNoCoordinates.push([part.coords[0], pos]);
  }
  return partNoCoordinates;
}

function getGearRatio(
  gear: PartNo,
  parts: PartNo[],
  matrix: string[][]
): number {
  const gearBoundingBox = getBoundingBox(gear.coords, matrix, true);
  const matchingParts: PartNo[] = [];
  for (const gearBoxCoord of gearBoundingBox) {
    for (const part of parts) {
      const partCoverage = expandPartCoordinates(part);
      for (const partCoord of partCoverage) {
        if (equalCoordinates(gearBoxCoord, partCoord)) {
          matchingParts.push(part);
        }
      }
    }
  }
  // Eliminate duplicates
  const matchingPartsDeduped: PartNo[] = [];
  for (const part of matchingParts) {
    if (!matchingPartsDeduped.find((p) => p.no === part.no))
      matchingPartsDeduped.push(part);
  }
  if (matchingPartsDeduped.length === 2) {
    return matchingPartsDeduped[0].no * matchingPartsDeduped[1].no;
  }
  return 0;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const parts = getParts(input);
  const matrix = readFileAsMatrix(file_path);
  const realParts = parts
    .map((part) => {
      const charsFound = scanBoundingBox(part, matrix);
      const filteredChars = [...charsFound]
        .filter((c) => c && isNaN(parseInt(c)))
        .filter((c) => c !== ".");
      if (filteredChars.length > 0) return part;
    })
    .filter((p) => !!p);
  const partNumSum = realParts.reduce((acc, part) => {
    if (!part) return acc;
    return acc + part.no;
  }, 0);
  console.log(realParts);
  write(partNumSum);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const matrix = readFileAsMatrix(file_path);
  const gears = getParts(input, /\*/g);
  const partNumbers = getParts(input);
  const gearRatios = gears.map((gear) => {
    return getGearRatio(gear, partNumbers, matrix);
  });
  const gearRatioSum = gearRatios.reduce((acc, ratio) => {
    return acc + ratio;
  }, 0);
  write(gearRatioSum);
}

solvePart2(inputFilePath);
