import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type Card = {
  cardNumber: number;
  winningNumbers: Set<string>;
  drawnNumbers: Set<string>;
};

function parseLine(line: string, lineIndex: number): Card {
  const numberString = line.split(":")[1].trim();
  const winningNumbersString = numberString.split("|")[0].trim();
  const drawnNumbersString = numberString.split("|")[1].trim();
  return {
    cardNumber: lineIndex + 1,
    winningNumbers: new Set(
      winningNumbersString.split(" ").filter((n) => n !== "")
    ),
    drawnNumbers: new Set(
      drawnNumbersString.split(" ").filter((n) => n !== "")
    ),
  };
}

function getWinningNumbers(card: Card): Set<string> {
  const { winningNumbers, drawnNumbers } = card;
  const drawnWinningNumbers = new Set<string>();
  winningNumbers.forEach((number) => {
    if (drawnNumbers.has(number)) {
      drawnWinningNumbers.add(number);
    }
  });
  return drawnWinningNumbers;
}

function scoreWinningNumbers(winningNumbers: Set<string>): number {
  const numberCount = winningNumbers.size;
  if (numberCount === 0) {
    return 0;
  }
  return 2 ** (numberCount - 1);
}

function scratchCard(
  deck: Card[],
  cardsToCheck: Card[],
  totalCardsScratched: number
): number {
  if (cardsToCheck.length === 0) {
    return totalCardsScratched;
  }
  const nextCardsToCheck: Card[] = [];
  for (const card of cardsToCheck) {
    const winningNumberCount = getWinningNumbers(card).size;
    if (winningNumberCount > 0) {
      for (let i = 1; i <= winningNumberCount; i++) {
        nextCardsToCheck.push(deck[card.cardNumber - 1 + i]);
      }
    }
    totalCardsScratched++;
  }

  return scratchCard(deck, nextCardsToCheck, totalCardsScratched);
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const lines = input.split("\n");
  const cards = lines.map(parseLine);
  const wins = cards.map(getWinningNumbers);
  const scores = wins.map(scoreWinningNumbers);
  const score = scores.reduce((acc, curr) => acc + curr, 0);
  write(score);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const lines = input.split("\n");
  const deck = lines.map(parseLine);
  const totalCardsScratched = scratchCard(deck, deck, 0);
  write(totalCardsScratched);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
