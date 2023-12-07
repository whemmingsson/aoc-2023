const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);
    const regex = /\d+/g;
    const times = [];
    const distances = [];
    data.split("\n").forEach((line, i) => {
      const match = [...line.matchAll(regex)];
      if (!match) return;
      match.forEach((m) => {
        if (i === 0) times.push(parseInt(m[0]));
        else distances.push(parseInt(m[0]));
      });
    });

    const races = [];
    for (let i = 0; i < times.length; i++) {
      races.push({
        time: times[i],
        distance: distances[i],
      });
    }

    const calcDist = (holdButtonMs, totalMs) => {
      // v = d/t => d = vt
      const runTime = totalMs - holdButtonMs;
      return runTime * holdButtonMs;
    };

    let winMult = 1;
    races.forEach((race, i) => {
      // Distance to beat: race.distance
      //console.log("Evaluating race", i);
      let wins = 0;
      for (let i = 0; i < race.time; i++) {
        let dist = calcDist(i, race.time);
        //console.log("time to hold=", i, " dist=", dist, "will win=", dist > race.distance);
        if (dist > race.distance) wins++;
      }

      //console.log("For race", i, "wins:", wins);
      //console.log("--------------------------");

      if (wins > 0) winMult *= wins;
    });

    console.log("Part 1:", winMult);

    // Part 2
    const race = {};
    data.split("\n").forEach((line, i) => {
      const p = line.split(":");
      const values = p[1]
        .split(" ")
        .filter((v) => v !== "")
        .map((v) => v.trim());

      let v = values.join("");
      console.log(v);

      if (i === 0) {
        race.time = parseInt(v);
      } else {
        race.distance = parseInt(v);
      }
    });

    console.log(race);

    console.log("Starting Big Race Calc");
    let wins = 0;
    for (let i = 0; i < race.time; i++) {
      let dist = calcDist(i, race.time);
      //console.log("time to hold=", i, " dist=", dist, "will win=", dist > race.distance);
      if (dist > race.distance) wins++;

      if (i % 1000000 === 0) console.log(i);
    }

    console.log("Part 2:", wins);
  }
};
