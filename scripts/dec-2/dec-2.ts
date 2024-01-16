import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePath: string = path.resolve(`${__dirname}/test-part-1.txt`);
const inputFile: string = path.resolve(`${__dirname}/input.txt`);

interface RoundResult {
  [key: string]: number;
}

function parseCubeCounts(cubeCounts: string[]): RoundResult {
  const out: { [key: string]: number } = {};
  for (const cubeCount of cubeCounts) {
    const [amount, type] = cubeCount.split(" ");
    out[type] = parseInt(amount);
  }
  return out;
}

function parseGameResult(gameResult: string): Array<RoundResult> {
  const rounds = gameResult.split(";").map((round) => round.trim());
  const roundResults = rounds.map((round) => {
    const cubeCounts = round.split(",").map((cubeCount) => cubeCount.trim());
    return parseCubeCounts(cubeCounts);
  });
  return roundResults;
}

const parseGame = (game: string) => {
  const [gameCount, gameResult] = game.split(":");
  const parsedGameResult = parseGameResult(gameResult);
  return parsedGameResult;
};

const validateRound = (round: RoundResult, possibleRound: RoundResult) => {
  for (const [key, value] of Object.entries(round)) {
    if (value > possibleRound[key]) {
      return false;
    }
  }
  return true;
};

function validateGames(
  game: Array<Array<RoundResult>>,
  possibleRound: RoundResult
): Array<boolean> {
  const gameValidities = game.map((round) =>
    round.every((round) => validateRound(round, possibleRound))
  );
  return gameValidities;
}

function sumGameIds(gamePossibilities: boolean[]) {
  let score = 0;
  gamePossibilities.forEach((gamePossibility, index) => {
    if (gamePossibility) {
      score += index + 1;
    }
  });
  return score;
}

function computeMinCubesRequired(game: Array<RoundResult>) {
  const minCubesRequired = game.reduce(
    (acc, round) => {
      for (const [key, value] of Object.entries(round)) {
        if (value > acc[key]) {
          acc[key] = value;
        }
      }
      return acc;
    },
    {
      red: 0,
      green: 0,
      blue: 0,
    }
  );
  return minCubesRequired;
}

function calculatePowerByGame(minCubes: Array<RoundResult>) {
  const powerByGame = minCubes.map((minCube) => {
    const power = Object.values(minCube).reduce((acc, amount) => {
      return acc * amount;
    }, 1);
    return power;
  });
  return powerByGame;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const gamesRaw = input.split("\n");
  const games = gamesRaw.map(parseGame);
  const possibleGames = validateGames(games, { red: 12, green: 13, blue: 14 });
  const score = sumGameIds(possibleGames);
  write(`Score: ${score}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const gamesRaw = input.split("\n");
  const games = gamesRaw.map(parseGame);
  const minCubesRequired = games.map(computeMinCubesRequired);
  const powerByGame = calculatePowerByGame(minCubesRequired);
  const powerSum = powerByGame.reduce((acc, power) => acc + power, 0);
  write(`Power Sum: ${powerSum}`);
}

solvePart2(inputFile);
