const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, true).split("\n");

    console.log(data);

    const parseMap = (r) => {
      return r;
    };

    const parseGroups = (g) => {
      return g
        .split(",")
        .map((v) => v.trim())
        .map((v) => parseInt(v));
    };

    const parseRow = (row) => {
      const p = row.split(" ");
      const map = parseMap(p[0]);
      const groups = parseGroups(p[1]);
      return { map, groups };
    };

    const isValid = (map, groups) => {
      if (map.indexOf("?") >= 0) return false;

      const mapGroups = map
        .split(".")
        .filter((v) => v !== "")
        .map((v) => v.length);

      if (mapGroups.length !== groups.length) return false;

      for (let i = 0; i < mapGroups.length; i++) {
        if (mapGroups[i] !== groups[i]) return false;
      }

      return true;
    };

    const options = ["#", "."];
    const generatePermutations = (options, length) => {
      if (length === 0) return [];

      const right = generatePermutations(options, length - 1);

      if (right.length == 0) {
        return options;
      }

      const result = [];
      options.forEach((opt) => {
        right.forEach((r) => {
          result.push(opt + r);
        });
      });

      return result;
    };

    const generatePossibleMap = (per, map, unknownIndecies) => {
      let copy = map.split("");
      unknownIndecies.forEach((p, i) => {
        copy[p] = per[i];
      });
      return copy.join("");
    };

    const countValidArrangements = (r) => {
      // Construct all arrangements
      const unknownIndecies = [];
      for (let i = 0; i < r.map.length; i++) {
        if (r.map[i] === "?") unknownIndecies.push(i);
      }

      let validCount = 0;
      generatePermutations(options, unknownIndecies.length).forEach((per) => {
        const map = generatePossibleMap(per, r.map, unknownIndecies);
        if (isValid(map, r.groups)) {
          validCount++;
        }
      });

      return validCount;
    };

    let sum = 0;
    data.forEach((row) => {
      const r = parseRow(row);
      sum += countValidArrangements(r);
    });

    console.log("Part 1", sum);
  }
};
