const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false).split("\n");

    const matrix = [];

    data.forEach((r, i) => {
      matrix[i] = [];
      r.split("").forEach((e, j) => {
        matrix[i].push({ x: j, y: i, energized: false, value: e.replace("\\", "X") });
      });
    });

    const direction = (beam) => {
      if (beam.dy === 1 && beam.dx === 0) return "D";
      if (beam.dy === -1 && beam.dx === 0) return "U";
      if (beam.dx === 1 && beam.dy === 0) return "R";
      if (beam.dx === -1 && beam.dy === 0) return "L";

      throw Error("YOU'RE A STUPID");
    };

    const lightBeam = {
      x: 0,
      y: 0,
      dy: 0,
      dx: 1,
    };

    let energized = {};
    let beams = [];
    beams.push(lightBeam);

    const countEnergized = () => {
      return Object.keys(energized).length;
    };

    const runBeams = () => {
      let newBeam = null;
      let newBeams = [];
      let toRemoveBeams = [];
      for (let i = 0; i < beams.length; i++) {
        let beam = beams[i];

        // Move to next tile
        beam.x += beam.dx;
        beam.y += beam.dy;

        if (beam.x >= 0 && beam.x < matrix[0].length && beam.y >= 0 && beam.y < matrix.length) {
          const k = beam.x + "_" + beam.y;
          energized[k] = { x: beam.x, y: beam.y };
        } else {
          //console.log("Beam is dead (outside of space)", beam.x, beam.y, "Max values:", matrix.length, matrix[0].length);
          toRemoveBeams.push(beam);
          continue;
        }

        let tile = matrix[beam.y][beam.x].value;

        const d = direction(beam);

        switch (tile) {
          case ".":
            // NAZING
            break;
          case "/":
            if (d === "U") {
              beam.dx = 1;
              beam.dy = 0;
            }
            if (d === "L") {
              beam.dx = 0;
              beam.dy = 1;
            }
            if (d === "R") {
              beam.dx = 0;
              beam.dy = -1;
            }
            if (d === "D") {
              beam.dx = -1;
              beam.dy = 0;
            }
            break;

          case "X": // \
            if (d === "U") {
              beam.dx = -1;
              beam.dy = 0;
            }
            if (d === "L") {
              beam.dx = 0;
              beam.dy = -1;
            }
            if (d === "R") {
              beam.dx = 0;
              beam.dy = 1;
            }
            if (d === "D") {
              beam.dx = 1;
              beam.dy = 0;
            }
            break;

          case "-":
            if (d === "L" || d === "R") {
              // NAZING
            } else if (d === "D" || d === "U") {
              // Current beam go left:
              beam.dy = 0;
              beam.dx = -1;

              // New beam go right
              newBeam = {
                x: beam.x,
                y: beam.y,
                dy: 0,
                dx: 1,
              };
              newBeams.push(newBeam);
            }
            break;
          case "|":
            if (d === "D" || d === "U") {
              // NAZING
            } else if (d === "R" || d === "L") {
              // Current beam go up:
              beam.dx = 0;
              beam.dy = -1;

              // New beam go down
              newBeam = {
                x: beam.x,
                y: beam.y,
                dy: 1,
                dx: 0,
              };
              newBeams.push(newBeam);
            }
        }
      }
      if (newBeams.length > 0) {
        beams.push(...newBeams);
      }
      if (toRemoveBeams.length > 0) {
        for (let j = 0; j < toRemoveBeams.length; j++) {
          let b = toRemoveBeams[j];
          const idx = beams.indexOf(b);
          beams.splice(idx, 1);
        }
      }
    };

    let sameResultCount = 0;
    let maxSameResults = 500000;
    do {
      //console.log("Running n", n, "Number of beams: ", beams.length);
      const prevEnergized = countEnergized();

      // Do algo
      runBeams();

      const energ = countEnergized();

      if (energ === prevEnergized) {
        sameResultCount++;
      }

      if (sameResultCount === maxSameResults || beams.length === 0) {
        break;
      }
    } while (true);

    //console.log(energized);

    for (let y = 0; y < matrix.length; y++) {
      console.log(
        matrix[y]
          .map((v, x) => {
            let k = x + "_" + y;
            if (energized[k]) {
              return "#";
            } else {
              return ".";
            }
          })
          .join("")
      );
    }

    console.log("Part 1", countEnergized() + 1);
  }
};
