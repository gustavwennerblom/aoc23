export function greatestCommonDivisor(a: number, b: number) {
  if (a !== 0) {
    return greatestCommonDivisor(b % a, a);
  }
  return b;
}

// use on array like `[1,2,3,4].reduce(leastCommonMultiple)
export function leastCommonMultiple(a: number, b: number) {
  return (a * b) / greatestCommonDivisor(a, b);
}

export function sumArray(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}
