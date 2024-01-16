import * as fs from "fs";

function readFile(path: string): string {
  const content = fs.readFileSync(path, "utf8");
  return content;
}

function readFileAsMatrix(path: string): Array<Array<string>> {
  const content = readFile(path);
  const lines = content.split("\n");
  const matrix = lines.map((line) => line.split(""));
  return matrix;
}

export { readFile, readFileAsMatrix };
