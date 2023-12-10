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

    const partOne = () => {
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
    };

    const partTwo = () => {
      // Part 2
      const endsWithA = (key) => {
        return key[2] === "A";
      };

      const endsWithZ = (key) => {
        return key[2] === "Z";
      };

      const allEndsWithZ = (list) => {
        return list.map((e) => e.key).every(endsWithZ);
      };

      const calculateCycleLength = (v, visited) => {
        let c = v;
        let i = 0;
        do {
          c = visited[c.key];
          i++;
        } while (c && c.key !== v.key);

        return i;
      };

      // Const starting with A:
      const starterKeys = Object.keys(dict).filter(endsWithA);
      console.log(starterKeys);

      let current = [];
      starterKeys.forEach((k) => {
        current.push(dict[k]);
      });

      const cycleLengths = [];

      const getNextInst = (c) => {
        if (c + 1 === instructions.length) return 0;
        return c + 1;
      };

      console.log("Number of cycles to track:", current.length);

      current.forEach((c) => {
        let instruction = 0;

        const visited = {};

        const seenBefore = (v) => {
          if (visited[v.key]) return true;
          return false;
        };

        let v = c;
        while (true) {
          let next = getNext(v, instructions[instruction]);
          visited[v.key] = next; // track the next node in the cycle
          v = next;

          if (seenBefore(v)) {
            // v is the same as a node we have seen before eg a cycle is formed started and ending at v.
            // How long is this cycle?
            let length = calculateCycleLength(v, visited);
            cycleLengths.push(length);
            console.log(length);

            //console.log("Already been at", v);
            // Cycled all the way back
            break;
          }

          instruction = getNextInst(instruction);
        }
      });

      console.log(cycleLengths);
      console.log(cycleLengths.reduce((a, b) => a * b));

      // 41946730093
    };

    partTwo();
  }
};
