const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const rawData = Parser.readRaw(__dirname, false).split("\n");
    const instructions = rawData[0].split("");
    const dict = {};

    let regex = /(\w{3}) = \((\w{3}), (\w{3})\)/;
    for (let i = 2; i < rawData.length; i++) {
      const parsed = regex.exec(rawData[i]);
      dict[parsed[1]] = { key: parsed[1], left: parsed[2], right: parsed[3] };
    }

    const getNext = (obj, dir) => {
      return dir === "L" ? dict[obj.left] : dict[obj.right];
    };

    let v = dict["AAA"];
    console.log(v);
    let steps = 1;
    let instruction = 0;

    while (v.key !== "ZZZ") {
      console.log("Step:", steps, "Instruction:", instructions[instruction], "Current:", v);
      v = getNext(v, instructions[instruction]);

      if (v.key === "ZZZ") {
        break;
      }

      steps++;
      instruction++;

      if (instruction === instructions.length) {
        instruction = 0; // Loop back
      }
    }

    console.log("Steps:", steps);
  }
};
