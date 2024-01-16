import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

function solvePart1(file_path: string) {
  const input = readFile(file_path);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
}

const start = Date.now();
solvePart1(testFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
