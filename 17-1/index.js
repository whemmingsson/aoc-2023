const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);

    // PART I
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] == data[(i + 1) % data.length]) {
        sum += parseInt(data[i]);
      }
    }
    console.log("part 1, sum:", sum);

    // PART 2
    sum = 0;
    const half = data.length / 2;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === data[(i + half) % data.length]) {
        sum += parseInt(data[i]);
      }
    }
    console.log("part 2, sum:", sum);
  }
};
