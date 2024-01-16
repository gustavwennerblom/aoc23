import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { sumArray } from "../../lib/mathStuff";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(input: string) {
  const lines = input.split("\n");
  const series = lines.map((line) =>
    line.split(" ").map((str) => parseInt(str))
  );
  return series;
}

function computeDiff(serie: number[]) {
  const diffSerie = [];
  for (let i = 0; i < serie.length - 1; i++) {
    diffSerie.push(serie[i + 1] - serie[i]);
  }
  return diffSerie;
}

function generateDiffSeries(serie: number[]) {
  const diffSeries = [];
  let currSerie = structuredClone(serie);
  diffSeries.push(currSerie);
  while (true) {
    const diffSerie = computeDiff(currSerie);
    diffSeries.push(diffSerie);
    currSerie = diffSerie;
    if (diffSerie.every((el) => el === 0)) {
      break;
    }
  }
  return diffSeries;
}

function extrapolate(series: number[][]) {
  let increment: number;
  while (series.length > 1) {
    const lastSerie = series.pop();
    if (lastSerie === undefined) throw new Error("Iterated past end of stack");
    increment = lastSerie[lastSerie.length - 1];
    const nextLastSerie = series[series.length - 1];
    nextLastSerie.push(nextLastSerie[nextLastSerie.length - 1] + increment);
  }
  return series[0];
}

function sumLastElements(series: number[][]) {
  const lastElements = series.map((serie) => serie[serie.length - 1]);
  return sumArray(lastElements);
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const originSeries = parseInput(input);
  const extrapolatedSeries = originSeries.map((originSerie) => {
    const diffSerie = generateDiffSeries(originSerie);
    const extrapolatedSerie = extrapolate(diffSerie);
    return extrapolatedSerie;
  });
  const lastElementsSum = sumLastElements(extrapolatedSeries);
  write(`Sum of last elements in extrapolated series: ${lastElementsSum}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const originSeries = parseInput(input);
  const reversedOriginSeries = originSeries.map((serie) => serie.reverse());
  const extrapolatedReversedSeries = reversedOriginSeries.map((originSerie) => {
    const diffSerie = generateDiffSeries(originSerie);
    const extrapolatedSerie = extrapolate(diffSerie);
    return extrapolatedSerie;
  });
  const firstElementsSum = sumLastElements(extrapolatedReversedSeries);
  write(`Sum of first elements in extrapolated series: ${firstElementsSum}`);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);

// Too high: 1834108703
