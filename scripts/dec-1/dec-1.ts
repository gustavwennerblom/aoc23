import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import path from "path";

function getChunks(inp: string) {
  return inp.split("\n");
}

const textReps: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

function parseStringFromBeginning(inp: string): string {
  // Replace first text representations of numbers with numbers
  const matches = [];
  for (const token of Object.keys(textReps)) {
    const firstTokenIndex = inp.indexOf(token);
    if (firstTokenIndex !== -1) {
      matches.push({ token, firstTokenIndex });
    }
  }
  // If no matches, return input
  if (matches.length === 0) {
    return inp;
  }
  matches.sort((a, b) => a.firstTokenIndex - b.firstTokenIndex);
  const firstMatch = matches[0];
  const out = inp.replace(
    firstMatch.token,
    textReps[firstMatch.token].toString()
  );
  return out;
}

function parseStringFromEnd(inp: string): string {
  // Replace last text representations of numbers with numbers
  const matches = [];
  for (const token of Object.keys(textReps)) {
    const lastTokenIndex = inp.lastIndexOf(token);
    if (lastTokenIndex !== -1) {
      matches.push({ token, lastTokenIndex });
    }
  }
  // If no matches, return input
  if (matches.length === 0) {
    return inp;
  }
  matches.sort((a, b) => a.lastTokenIndex - b.lastTokenIndex);
  const lastMatch = matches[matches.length - 1];
  const out = inp.replace(
    new RegExp(lastMatch.token, "g"),
    textReps[lastMatch.token].toString()
  );
  return out;
}

function extractFirstNumber(chunk: string): number {
  const parsedChunk = parseStringFromBeginning(chunk);
  const tokens = parsedChunk.split("");
  let firstNumber: number | null = null;
  for (const token of tokens) {
    const tokenVal = parseInt(token);
    if (!Number.isNaN(tokenVal)) {
      firstNumber = tokenVal;
      break;
    }
  }
  if (firstNumber === null) {
    throw new Error(`Could not extract first number from chunk: ${chunk}`);
  }
  return firstNumber;
}

function extractLastNumber(chunk: string): number {
  const parsedChunk = parseStringFromEnd(chunk);
  const tokens = parsedChunk.split("");
  let lastNumber: number | null = null;
  for (const token of tokens) {
    const tokenVal = parseInt(token);
    if (!Number.isNaN(tokenVal)) {
      lastNumber = tokenVal;
    }
  }
  if (lastNumber === null) {
    throw new Error(`Could not extract last number from chunk: ${chunk}`);
  }
  return lastNumber;
}

function getCalibrationValues(input: string) {
  const chunks = getChunks(input);
  const calibrationValues: Array<[number, number]> = [];
  for (const chunk of chunks) {
    const firstValue = extractFirstNumber(chunk);
    const lastValue = extractLastNumber(chunk);
    calibrationValues.push([firstValue, lastValue]);
    write(`Chunk: ${chunk} : ${firstValue} , ${lastValue}`);
  }
  return calibrationValues;
}

function sumCalibrationValues(vals: Array<[number, number]>): number {
  let total = 0;
  for (const val of vals) {
    const tuple_concat = parseInt(`${val[0]}${val[1]}`);
    total += tuple_concat;
  }
  return total;
}

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFile: string = path.resolve(`${__dirname}/input.txt`);

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const calVals = getCalibrationValues(input);
  const total = sumCalibrationValues(calVals);
  write(total);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const calVals = getCalibrationValues(input);
  const total = sumCalibrationValues(calVals);
  write(total);
}

solvePart2(inputFile);
