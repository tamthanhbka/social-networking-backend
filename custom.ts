import colors from "colors";
const log = console.log.bind(console);

console.log = function (...args: any[]) {
  console.clear();
  if (args.length === 1 && typeof args[0] === "string")
    log(colors.rainbow(args[0]));
  else log(...args);
};
