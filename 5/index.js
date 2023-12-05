const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);
    const seedsKey = "seeds:";
    const mapKey = "map:";
    let seeds = [];
    let seedRanges = [];
    const maps = [];

    const lines = data.split("\n");

    const parseSeeds = (line) => {
      const p = line.split(":");
      return p[1]
        .split(" ")
        .map((s) => parseInt(s.trim()))
        .filter((s) => !isNaN(s));
    };

    const parsePairSeeds = (line) => {
      const seeds = parseSeeds(line);
      const ranges = [];
      for (let i = 0; i < seeds.length - 1; i++) {
        if (i % 2 === 0) {
          ranges.push({ start: seeds[i], length: seeds[i + 1] });
        }
      }
      return ranges;
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

      return { i: i - 1, map: { header: header, maps: ranges } };
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "") {
        // Skip empty line
      } else if (line.includes(seedsKey)) {
        seeds = parseSeeds(line);
        seedRanges = parsePairSeeds(line);
      } else if (line.includes(mapKey)) {
        const result = parseMap(line, i);
        i = result.i;
        maps.push(result.map);
      }
    }

    // Maps the current input to an output using the provided map
    const mapValue = (input, map) => {
      const isInRange = (value, rangeStart, rangeLength) => {
        return value >= rangeStart && value < rangeStart + rangeLength;
      };

      for (let i = 0; i < map.maps.length; i++) {
        const range = map.maps[i];
        if (isInRange(input, range.source, range.length)) {
          const offset = input - range.source;
          return range.destination + offset;
        }
      }

      // No mapping possible
      return input;
    };

    // Part 1
    const locations = [];
    seeds.forEach((seed) => {
      let v = seed;
      for (let i = 0; i < maps.length; i++) {
        v = mapValue(v, maps[i]);
      }
      locations.push(v);
    });

    // Part 2 - store only minimum value. Otherwise we will run out of memory

    // Verification we actually have the proper seed ranges
    let numberOfSeeds = 0;
    seedRanges.forEach((r, i) => {
      console.log("Range ", i, r.start, r.length);
      numberOfSeeds += r.length;
    });

    // Verification that the total number of seeds is correct
    console.log("Number of seeds", numberOfSeeds);

    let totalEvaluatedSeeds = 0;
    let min = Number.MAX_VALUE;
    let minSeed = -1;
    console.log("------------------------");
    seedRanges.forEach((range, n) => {
      // Logging to make sure we make progress..
      console.log("Starting range", n);
      let seedsEvaluated = 0;

      // Iterate over all seed numbers in the full range
      for (let i = range.start; i < range.start + range.length; i++) {
        let v = i;
        // Map from seed -> location
        //console.log(" Considering seed", i);
        for (let j = 0; j < maps.length; j++) {
          v = mapValue(v, maps[j]);
        }
        // Reassign minimum if lower than current minimum
        if (v < min) {
          min = v;
          minSeed = i; // Keep track of which seed leads to min location
        }
        // To verify we are actually considering the exact number of seeds
        seedsEvaluated++;
      }
      console.log("Current minimum:", min);
      console.log("Evaluated", seedsEvaluated, "seeds");
      console.log("------------------------");
      totalEvaluatedSeeds += seedsEvaluated;
    });

    console.log("Part 1", Math.min(...locations));
    console.log("Part 2", min);
    console.log("Minimum seed", minSeed);
    console.log("Total evaluated seeds", totalEvaluatedSeeds);
  }
};
