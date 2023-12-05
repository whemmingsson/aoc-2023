const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, true);
    const seedsKey = "seeds:";
    const mapKey = "map:";
    let seeds = [];
    const maps = [];

    const lines = data.split("\n");

    const parseSeeds = (line) => {
      const p = line.split(":");
      return p[1]
        .split(" ")
        .map((s) => parseInt(s.trim()))
        .filter((s) => !isNaN(s));
    };

    const parseMap = (line, i) => {
      const parseRangeData = (line) => {
        const values = line
          .split(" ")
          .map((s) => parseInt(s.trim()))
          .filter((s) => !isNaN(s));

        const r = {
          destination: values[0],
          source: values[1],
          length: values[2],
        };
        return r;
      };
      const p = line.split(" ");
      const header = p[0].trim();

      i++;
      let parseLine;
      const ranges = [];
      do {
        if (i >= lines.length) {
          break;
        }
        parseLine = lines[i];
        if (parseLine.trim() !== "") ranges.push(parseRangeData(parseLine));
        i++;
      } while (parseLine.trim() !== "");

      console.log("### " + header + " ###");
      console.log(ranges);
      console.log("--------------------------------------------");
      console.log();

      return { i: i - 1, map: { header: header, maps: ranges } };
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "") {
        // Skip empty line
      } else if (line.includes(seedsKey)) {
        seeds = parseSeeds(line);
      } else if (line.includes(mapKey)) {
        const result = parseMap(line, i);
        i = result.i;
        maps.push(result.map);
      }
    }

    //console.log(seeds);
    console.log(maps);

    console.log("Part 1");
    console.log("Part 2");
  }
};
