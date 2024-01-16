import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type Race = {
  raceTime: number;
  distance: number;
}

function parseInputPart1(input: string): Race[] {
  const rows = input.split("\n");
  const times = rows[0].split(" ").filter((x) => x !== "");
  const distances = rows[1].split(" ").filter((x) => x !== "");
  times.shift();
  distances.shift();
  const races = times.map((time, index) => ({
    raceTime: parseInt(time),
    distance: parseInt(distances[index]),
  }));
  return races;
}

function parseInputPart2(input: string): Race {
  const rows = input.split("\n");
  const timeParts = rows[0].split(" ").filter((x) => x !== "");
  const distanceParts = rows[1].split(" ").filter((x) => x !== "");
  timeParts.shift();
  distanceParts.shift();
  const time = timeParts.join("")
  const distance = distanceParts.join("")
  return {
    raceTime: parseInt(time),
    distance: parseInt(distance),
  };
}

function getSpeed(buttonTime: number): number {
  return buttonTime
}

function getDistance(buttonTime: number, raceTime: number): number {
  const travelTime = raceTime - buttonTime;
  const distance = travelTime * getSpeed(buttonTime);
  return distance;
}

function getPossibleWins(race:Race) {
  const possibleWins = [];
  for (let buttonTime=0; buttonTime <=race.raceTime; buttonTime++) {
    if(getDistance(buttonTime, race.raceTime) > race.distance) {
      possibleWins.push(buttonTime);
    }
  }
  return possibleWins;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const races = parseInputPart1(input);
  const possibleWins = races.map(getPossibleWins);
  const res = possibleWins.reduce((acc, curr) => acc * curr.length, 1);
  write (`Solution: ${res}`)
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const race = parseInputPart2(input);
  const possibleWins =  getPossibleWins(race);
  write (`Solution: ${possibleWins.length}`)
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
