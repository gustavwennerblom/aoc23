import path from "path";
import { readFile } from "../../lib/reader";
import { write } from "../../lib/writer";

const testFilePath: string = path.resolve(`${__dirname}/test.txt`);
const inputFilePath: string = path.resolve(`${__dirname}/input.txt`);

type LineParams2D = { k: number; m: number };
type Point2D = { x: number; y: number };

function compute2dLineEquation(point1: Point2D, point2: Point2D) {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const k = (y2 - y1) / (x2 - x1);
  const m = y1 - k * x1;
  return { k, m };
}

function computeIntersectionPoint(line1: LineParams2D, line2: LineParams2D) {
  const { k: k1, m: m1 } = line1;
  const { k: k2, m: m2 } = line2;
  const x = (m2 - m1) / (k1 - k2);
  const y = k1 * x + m1;
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }
  return { x, y };
}

function parseInput(input: string) {
  const lines = input.split("\n");
  const pointVelocityPairs = lines.map((line) => {
    const [pointsStr, velocitiesStr] = line.split(" @ ");
    const points = pointsStr.split(", ").map((pointStr) => parseInt(pointStr));
    const velocities = velocitiesStr
      .split(", ")
      .map((velStr) => parseInt(velStr));
    return { points, velocities };
  });
  return pointVelocityPairs;
}

function computeXYpoints(
  pointVelocityPairs: { points: number[]; velocities: number[] }[]
) {
  const points = pointVelocityPairs.map((pair) => {
    const { points, velocities } = pair;
    const [x, y] = points;
    const [vx, vy] = velocities;
    return [
      { x, y },
      { x: x + vx, y: y + vy },
    ];
  });
  return points;
}

function isFuture(intersection: Point2D, point1: Point2D, point2: Point2D) {
  const xFuture =
    Math.abs(intersection.x - point2.x) < Math.abs(intersection.x - point1.x);
  const yFuture =
    Math.abs(intersection.y - point2.y) < Math.abs(intersection.y - point1.y);
  return xFuture && yFuture;
}

function isInside(intersection: Point2D, max: Point2D, min: Point2D) {
  const xInside = intersection.x >= min.x && intersection.x <= max.x;
  const yInside = intersection.y >= min.y && intersection.y <= max.y;
  return xInside && yInside;
}

function solvePart1(file_path: string) {
  const input = readFile(file_path);
  const pointVelocityPairs = parseInput(input);
  const points = computeXYpoints(pointVelocityPairs);

  let intersections = 0;

  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const pointA1 = points[i][0];
      const pointA2 = points[i][1];
      const pointB1 = points[j][0];
      const pointB2 = points[j][1];
      const lineA = compute2dLineEquation(pointA1, pointA2);
      const lineB = compute2dLineEquation(pointB1, pointB2);
      const intersection = computeIntersectionPoint(lineA, lineB);
      if (
        intersection &&
        isFuture(intersection, pointA1, pointA2) &&
        isFuture(intersection, pointB1, pointB2) &&
        isInside(
          intersection,
          { x: 400000000000000, y: 400000000000000 },
          { x: 200000000000000, y: 200000000000000 }
        )
      ) {
        intersections++;
      }
    }
  }
  write(`Part 1: Valid intersections: ${intersections}`);
}

function solvePart2(file_path: string) {
  const input = readFile(file_path);
  const pointVelocityPairs = parseInput(input);
  const points = computeXYpoints(pointVelocityPairs);

  const intersections: Point2D[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const pointA1 = points[i][0];
      const pointA2 = points[i][1];
      const pointB1 = points[j][0];
      const pointB2 = points[j][1];
      const lineA = compute2dLineEquation(pointA1, pointA2);
      const lineB = compute2dLineEquation(pointB1, pointB2);
      const intersection = computeIntersectionPoint(lineA, lineB);
      if (
        intersection &&
        isFuture(intersection, pointA1, pointA2) &&
        isFuture(intersection, pointB1, pointB2) &&
        isInside(intersection, { x: 27, y: 27 }, { x: 7, y: 7 })
      ) {
        intersections.push(intersection);
      }
    }
  }
  return;
}

const start = Date.now();
solvePart2(testFilePath);
const end = Date.now();
write(`Execution time: ${end - start} ms`);
