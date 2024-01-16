import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function matchCondition(
  partialSpringRow: string,
  condCounts: number[]
): boolean {
  const damagedGroups = partialSpringRow.split(".").filter((c) => c !== "");
  let match = false;
  // If the number of damaged groups doesn't match the number of conditions, we can't match
  if (damagedGroups.length !== condCounts.length) {
    return match;
  }
  for (let i = 0; i < condCounts.length; i++) {
    if (damagedGroups[i].length === condCounts[i]) {
      match = true;
    } else {
      match = false;
      break;
    }
  }
  if (match) {
    return true;
  }
  return match;
}

function countArrangements(
  springRow: string,
  condCounts: number[],
  currCond: number,
  pos: number
): number {
  if (pos === springRow.length + 1) {
    const match = matchCondition(springRow, condCounts);
    // End of springRow, all conditions met
    if (match) {
      return 1;
    }
    return 0;
  }
  // Current position is operational or we're beyond the end of the string, we look back
  if (springRow[pos] === "." || pos === springRow.length) {
    const knownSpringRow = springRow.slice(0, pos);

    // If the damaged profile matches the expected one, we continue to the next condition
    if (matchCondition(knownSpringRow, condCounts)) {
      return countArrangements(springRow, condCounts, currCond + 1, pos + 1);
    }
    // Else, we continue forward
    return countArrangements(springRow, condCounts, currCond, pos + 1);
  }
  // Current position is not operational, we continue forward
  if (springRow[pos] === "#") {
    return countArrangements(springRow, condCounts, currCond, pos + 1);
  }
  // Implicitly, current position is a "?" and we have two options
  const operationalAlt =
    springRow.substring(0, pos) + "." + springRow.substring(pos + 1);
  const damagedAlt =
    springRow.substring(0, pos) + "#" + springRow.substring(pos + 1);
  return (
    countArrangements(operationalAlt, condCounts, currCond, pos) +
    countArrangements(damagedAlt, condCounts, currCond, pos)
  );
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const rows = input.split("\n");
  const possibleArrangements = [];
  for (const row of rows) {
    const [springRow, conditionsCountStr] = row.split(" ");
    const conditionsCount = conditionsCountStr
      .split(",")
      .map((c) => parseInt(c));
    const arrangements = countArrangements(springRow, conditionsCount, 0, 0);
    possibleArrangements.push(arrangements);
  }
  const totalArrangements = possibleArrangements.reduce(
    (acc, curr) => acc + curr
  );
  write(totalArrangements.toString());
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const rows = input.split("\n");
  const possibleArrangements = [];
  for (const [idx, row] of rows.entries()) {
    console.log("Processing row: ", idx);
    const [springRowFolded, conditionsCountStrFolded] = row.split(" ");
    const springRow = Array(5).fill(springRowFolded).join("?");
    const conditionsCountStr = Array(5)
      .fill(conditionsCountStrFolded)
      .join(",");
    const conditionsCount = conditionsCountStr
      .split(",")
      .map((c) => parseInt(c));
    const arrangements = countArrangements(springRow, conditionsCount, 0, 0);
    console.log("Arrangements: ", arrangements);
    possibleArrangements.push(arrangements);
  }
  const totalArrangements = possibleArrangements.reduce(
    (acc, curr) => acc + curr
  );
  write(totalArrangements.toString());
}

const start = Date.now();
solvePart2(testFilePart1Path);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
