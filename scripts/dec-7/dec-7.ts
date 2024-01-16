import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import {
  HandOfCards,
  Card,
  valuateCard,
  calcFiveCardHandType,
} from "../../lib/playingCards";

const testFilePart1Path: string = path.resolve(`${__dirname}/test-part-1.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test-part-2.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function parseInput(input: string): { hand: HandOfCards; bid: number }[] {
  const lines = input.split("\n");
  return lines.map((line) => {
    const [handString, bidString] = line.split(" ").map((s) => s.trim());
    const cards: Card[] = handString
      .split("")
      .map((symbol) => ({ symbol }))
      .map((card) => ({ ...card, strength: valuateCard(card) }));
    const bid = Number(bidString);
    return { hand: { cards }, bid };
  });
}

function compareHandStrenghts(
  handA: { hand: HandOfCards; bid: number },
  handB: { hand: HandOfCards; bid: number }
): number {
  if (!handA.hand.strength || !handB.hand.strength)
    throw new Error("Hand strength not set");
  if (handA.hand.strength < handB.hand.strength) return 1;
  if (handA.hand.strength > handB.hand.strength) return -1;
  return 0;
}

function compareFirstCardStrength(
  handA: { hand: HandOfCards; bid: number },
  handB: { hand: HandOfCards; bid: number }
): number {
  for (let i = 0; i < 5; i++) {
    if (handA.hand.cards[i].strength! < handB.hand.cards[i].strength!) return 1;
    if (handA.hand.cards[i].strength! > handB.hand.cards[i].strength!)
      return -1;
  }
  return 0;
}

function calculateWinnings(
  hands: { hand: HandOfCards; bid: number }[]
): number {
  let winnings = 0;
  for (const [idx, hand] of hands.entries()) {
    winnings += hand.bid * (hands.length - idx);
  }
  return winnings;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const rawHandsAndBids = parseInput(input);
  const handsAndBids = rawHandsAndBids.map(({ hand, bid }) => ({
    hand: calcFiveCardHandType(hand, true),
    bid,
  }));
  const sortedHandsAndBids = structuredClone(handsAndBids)
    .sort(compareFirstCardStrength)
    .sort(compareHandStrenghts);
  write(calculateWinnings(sortedHandsAndBids));
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const rawHandsAndBids = parseInput(input);
  const handsAndBids = rawHandsAndBids.map(({ hand, bid }) => ({
    hand: calcFiveCardHandType(hand, true, "J"),
    bid,
  }));
  const sortedHandsAndBids = structuredClone(handsAndBids)
    .sort(compareFirstCardStrength)
    .sort(compareHandStrenghts);
  write(calculateWinnings(sortedHandsAndBids));
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
