import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";
import { LinkedList, LinkedListNode } from "@datastructures-js/linked-list";
import { leastCommonMultiple } from "../../lib/mathStuff";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const testFilePart2Path: string = path.resolve(`${__dirname}/test2.txt`);

const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type CamelMap = {
  [key: string]: { L: string; R: string };
};

type Instruction = "L" | "R";

function parseInput(input: string) {
  const lines = input.split("\n");
  const instructions = lines.shift()?.split("") as string[];
  lines.shift();
  const map: CamelMap = {};
  for (const line of lines) {
    const [key, directions] = line.split(" = ");
    const clean_directions = directions.replace(/\(/g, "").replace(/\)/g, "");
    const [left, right] = clean_directions.split(", ");
    map[key] = { L: left, R: right };
  }
  return { instructions, map };
}

function convertInstructionsToLinkedList(instructions: string[]) {
  const linkedList = new LinkedList<string>();
  for (const instruction of instructions) {
    linkedList.insertLast(instruction);
  }
  linkedList.insertLast(linkedList.head());
  return linkedList;
}

function followMap(
  startElement: string,
  instrList: LinkedList<string>,
  map: CamelMap
) {
  let instrNode = instrList.head();
  let currElement = startElement;
  let steps = 1;
  while (true) {
    const instruction = instrNode.getValue() as Instruction;
    if (instruction === "L") {
      currElement = map[currElement].L;
    } else {
      currElement = map[currElement].R;
    }
    if (currElement.split("")[2] === "Z") {
      break;
    }
    instrNode = instrNode.getNext();
    steps++;
  }
  return steps;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const { instructions, map } = parseInput(input);
  const instrList = convertInstructionsToLinkedList(instructions);

  const steps = followMap("AAA", instrList, map);
  write(`Found ZZZ in ${steps} steps`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const { instructions, map } = parseInput(input);
  const instrList = convertInstructionsToLinkedList(instructions);

  const startNodes = Object.keys(map).filter((key) => !!key.match(/..A/));
  const stepsArr = startNodes.map((startNode) =>
    followMap(startNode, instrList, map)
  );
  const minStepsRequired = stepsArr.reduce(leastCommonMultiple);
  write(`Found all-..Z-nodes in ${minStepsRequired} steps`);
}

const start = Date.now();
solvePart2(inputFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
