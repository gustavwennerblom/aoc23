import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { sumArray } from "../../lib/mathStuff";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const testFile2Path: string = path.resolve(`${__dirname}/test2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(input: string): string[] {
  return input.split(",");
}

function computeHash(step: string): number {
  let curr = 0;
  for (const token of step.split("")) {
    curr += token.charCodeAt(0);
    curr = curr * 17;
    curr = curr % 256;
  }
  return curr;
}

type BoxLine = Array<
  {
    label: string;
    focusingPower: number;
  }[]
>;

function placeLenses(steps: string[]): BoxLine {
  const boxLine: BoxLine = [...Array(256)].map(() => []);
  for (const step of steps) {
    if (step.includes("=")) {
      const [textLabel, focusingPowerStr] = step.split("=");
      const focusingPower = parseInt(focusingPowerStr);
      const hashedLabel = computeHash(textLabel);
      // If there is already a lens in the box with the same label, replace the old lens with the new lens
      if (boxLine[hashedLabel].some((lens) => lens.label === textLabel)) {
        for (const [lensIdx, lens] of boxLine[hashedLabel].entries()) {
          if (lens.label === textLabel) {
            boxLine[hashedLabel][lensIdx] = {
              label: textLabel,
              focusingPower,
            };
          }
        }
        // If there is not already a lens in the box with the same label, add the lens to the box immediately behind any lenses already in the box.
      } else {
        boxLine[hashedLabel].push({
          label: textLabel,
          focusingPower,
        });
      }
    }
    if (step.includes("-")) {
      const textLabel = step.split("-")[0];
      const hashedLabel = computeHash(textLabel);
      for (const [lensIdx, lens] of boxLine[hashedLabel].entries()) {
        if (lens.label === textLabel) {
          boxLine[hashedLabel].splice(lensIdx, 1);
        }
      }
    }
  }
  return boxLine;
}

function computeFocusingPowers(boxLine: BoxLine) {
  const focusingPowers: number[] = [];
  for (const [boxIdx, box] of boxLine.entries()) {
    for (const [lensIdx, lens] of box.entries()) {
      const f1 = boxIdx + 1;
      const f2 = lensIdx + 1;
      const f3 = lens.focusingPower;
      focusingPowers.push(f1 * f2 * f3);
    }
  }
  return focusingPowers;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const steps = parseInput(input);
  const hashes = steps.map(computeHash);
  const hashesSum = sumArray(hashes);
  write(`Hashes sum: ${hashesSum}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const steps = parseInput(input);
  const boxLine = placeLenses(steps);
  const focusingPowers = computeFocusingPowers(boxLine);
  const res = sumArray(focusingPowers);
  write(`Focusing powers sum: ${res}`);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
