const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false).split("\n");

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
      // Part 2
      const map = parseMap(p[0] + "." + p[0] + "." + p[0] + "." + p[0] + "." + p[0]);
      const groups = parseGroups(p[1] + "," + p[1] + "," + p[1] + "," + p[1] + "," + p[1]);
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

    const cache = {};
    const getPermuations = (len) => {
      if (cache[len]) {
        console.log("Found", len, "in cache, #=", cache[len].length);
        return cache[len];
      }
      const p = generatePermutations(options, len);
      cache[len] = p;
      return p;
    };

    const countValidArrangements = (r) => {
      // Construct all arrangements
      const unknownIndecies = [];
      for (let i = 0; i < r.map.length; i++) {
        if (r.map[i] === "?") unknownIndecies.push(i);
      }

      let validCount = 0;
      console.log(" Started generating permuations...");
      let pers = getPermuations(unknownIndecies.length);
      console.log(" Done!", pers.length);
      console.log();

      console.log(" Started testing permuations...");
      pers.forEach((per) => {
        const map = generatePossibleMap(per, r.map, unknownIndecies);
        if (isValid(map, r.groups)) {
          validCount++;
        }
      });
      console.log(" Done!", validCount);

      return validCount;
    };

    let sum = 0;
    let s = new Date();
    data.forEach((row, i) => {
      const r = parseRow(row);
      console.log("Starting row", i, r);
      sum += countValidArrangements(r);
    });

    console.log("Run time", new Date() - s);
    console.log("Part 1", sum);

    // Run time 9286 (before optimization);
    // Run time 8411 (after optiomization);
  }
};
