import chalk from "chalk";

function write(
  thing:
    | string
    | number
    | string[]
    | number[]
    | Array<string | number | number[]>
) {
  console.log(chalk.whiteBright.bgBlue(thing));
}

export { write };
