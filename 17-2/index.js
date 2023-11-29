const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "array",
        valueType: "int",
        delimiter: " ",
      },
    ]);

    // PART ONE
    let sum = 0;
    data.forEach((row) => {
      sum += Math.max(...row) - Math.min(...row);
    });

    console.log("Part 1", sum);

    // PART TWO
    const evenlyDivide = (a, b) => {
      if (a % b === 0) return a / b;
      if (b % a === 0) return b / a;
      return null;
    };

    sum = 0;
    data.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        for (let j = i + 1; j < row.length; j++) {
          const v = evenlyDivide(row[i], row[j]);
          if (v) sum += v;
        }
      }
    });

    console.log("Part 2", sum);
  }
};
