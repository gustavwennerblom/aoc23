import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type ElfMapGroup = {
  name: string;
  maps: ElfMap[];
};

type ElfMap = {
  sourceStartIndex: number;
  sourceEndIndex: number;
  sourceToDestinationTerm: number;
};

function parseBlock(block: string) {
  const isMap = block.includes("map");
  const subMaps: ElfMap[] = [];
  if (!isMap) {
    return block
      .split(":")[1]
      .trim()
      .split(" ")
      .map((n) => parseInt(n));
  }
  const lines = block.split("\n");
  const firstLine = lines.shift();
  if (!firstLine) throw Error("Invalid block");
  const name = firstLine.split(":")[0].trim();
  for (const line of lines) {
    const [destinationRangeStart, sourceRangeStart, rangeLength] =
      line.split(" ");
    const sourceStartIndex = parseInt(sourceRangeStart);
    const sourceEndIndex = parseInt(sourceRangeStart) + parseInt(rangeLength);
    const sourceToDestinationTerm =
      parseInt(destinationRangeStart) - sourceStartIndex;
    subMaps.push({
      sourceStartIndex,
      sourceEndIndex,
      sourceToDestinationTerm,
    });
  }
  return {
    name,
    maps: subMaps,
  };
}

function resolveDestination(source: number, mapGroups: ElfMapGroup[]) {
  const mapGroup = mapGroups.shift();
  if (!mapGroup) return source;
  const { maps } = mapGroup;
  for (const map of maps) {
    if (source >= map.sourceStartIndex && source <= map.sourceEndIndex) {
      return resolveDestination(
        source + map.sourceToDestinationTerm,
        mapGroups
      );
    }
  }
  return resolveDestination(source, mapGroups);
}

function resolveOrigin(destination: number, mapGroups: ElfMapGroup[]) {
  const mapGroup = mapGroups.pop();
  if (!mapGroup) return destination;
  const { maps } = mapGroup;
  for (const map of maps) {
    if (
      destination >= map.sourceStartIndex + map.sourceToDestinationTerm &&
      destination <= map.sourceEndIndex + map.sourceToDestinationTerm
    )
      return resolveOrigin(
        destination - map.sourceToDestinationTerm,
        mapGroups
      );
  }
  return resolveOrigin(destination, mapGroups);
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const blocks = input.split("\n\n");
  const seeds = parseBlock(blocks.shift()!) as number[];
  const mapGroups = blocks.map((block) => parseBlock(block) as ElfMapGroup);
  const seedLocations: number[] = [];
  for (const seed of seeds) {
    const seedLocation = resolveDestination(seed, structuredClone(mapGroups));
    write(`Seed ${seed} location: ${seedLocation}`);
    seedLocations.push(seedLocation);
  }
  const minSeedLocation = Math.min(...seedLocations);
  write(`Min seed location: ${minSeedLocation}`);
}

function getSeedRanges(seedCodes: number[]): [number, number][] {
  const seedRanges: [number, number][] = [];
  while (seedCodes.length > 0) {
    const firstSeed = seedCodes.shift() as number;
    const seedsToAdd = seedCodes.shift() as number;
    seedRanges.push([firstSeed, firstSeed + seedsToAdd]);
  }
  return seedRanges;
}

function isSeed(seed: number, seedRanges: [number, number][]) {
  for (const [start, end] of seedRanges) {
    if (seed >= start && seed <= end) return true;
  }
  return false;
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const blocks = input.split("\n\n");
  const seedsBase = parseBlock(blocks.shift()!) as number[];
  const seedRanges = getSeedRanges(seedsBase);
  const mapGroups = blocks.map((block) => parseBlock(block) as ElfMapGroup);
  for (let location = 0; location < Number.MAX_VALUE; location++) {
    // last input solution location = 24261545
    const maybeSeed = resolveOrigin(location, structuredClone(mapGroups));
    if (isSeed(maybeSeed, seedRanges)) {
      write(`Seed ${maybeSeed} location: ${location}`);
      return;
    }
    if (location % 100000 === 0)
      write(
        `${new Date().toLocaleTimeString()} Checked location: ${location}. Seed: ${maybeSeed} is not in range`
      );
  }
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
