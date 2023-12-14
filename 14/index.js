const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "array",
        valueType: "string",
        delimiter: "",
      },
    ]);

    // Transform
    const map = [];
    for (let y = 0; y < data.length; y++) {
      const row = data[y];
      map[y] = [];
      for (let x = 0; x < row.length; x++) {
        map[y].push({ rock: data[y][x], x: x, y: y });
      }
    }

    console.log("BEFORE SHIFTING");
    // Print map
    for (let y = 0; y < map.length; y++) {
      console.log(map[y].map((r) => r.rock).join(""));
    }

    const runCycle = (N, useCache) => {
      const dict = {};
      for (let n = 1; n < N + 1; n++) {
        // Shift up
        for (let y = map.length - 1; y > 0; y--) {
          for (let x = 0; x < map[y].length; x++) {
            let rock = map[y][x];
            let rockAbove = map[y - 1][x];
            if (rock.rock === "O" && rockAbove.rock === ".") {
              rock.rock = ".";
              rockAbove.rock = "O";
            } else if (rock.rock === "O" && rockAbove.rock === "O") {
              let i = y;
              while (i >= 1 && map[i][x].rock !== "." && map[i][x].rock !== "#") {
                i--;
              }
              if (map[i][x].rock === ".") {
                rock.rock = ".";
                map[i][x].rock = "O";
              }
            }
          }
        }

        // Shift west
        for (let y = 0; y < map.length; y++) {
          for (let x = map[y].length - 1; x > 0; x--) {
            let rock = map[y][x];
            let rockToLeft = map[y][x - 1];
            if (rock.rock === "O" && rockToLeft.rock === ".") {
              rock.rock = ".";
              rockToLeft.rock = "O";
            } else if (rock.rock === "O" && rockToLeft.rock === "O") {
              let i = x;
              while (i >= 1 && map[y][i].rock !== "." && map[y][i].rock !== "#") {
                i--;
              }
              if (map[y][i].rock === ".") {
                rock.rock = ".";
                map[y][i].rock = "O";
              }
            }
          }
        }

        // Shift down
        for (let y = 0; y < map.length - 1; y++) {
          for (let x = 0; x < map[y].length; x++) {
            let rock = map[y][x];
            let rockBelow = map[y + 1][x];
            if (rock.rock === "O" && rockBelow.rock === ".") {
              rock.rock = ".";
              rockBelow.rock = "O";
            } else if (rock.rock === "O" && rockBelow.rock === "O") {
              let i = y;
              while (i < map.length - 1 && map[i][x].rock !== "." && map[i][x].rock !== "#") {
                i++;
              }
              if (map[i][x].rock === ".") {
                rock.rock = ".";
                map[i][x].rock = "O";
              }
            }
          }
        }

        // Shift east
        for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[y].length - 1; x++) {
            let rock = map[y][x];
            let rightToRight = map[y][x + 1];
            if (rock.rock === "O" && rightToRight.rock === ".") {
              rock.rock = ".";
              rightToRight.rock = "O";
            } else if (rock.rock === "O" && rightToRight.rock === "O") {
              let i = x;
              while (i <= map.length - 1 && map[y][i].rock !== "." && map[y][i].rock !== "#") {
                i++;
              }
              if (map[y][i] && map[y][i].rock === ".") {
                rock.rock = ".";
                map[y][i].rock = "O";
              }
            }
          }
        }

        let hash = createHash();
        console.log(n, "-->", hash);
        if (useCache) {
          if (dict[hash]) {
            console.log("FOUND MATCH on cycle", n, "matches with cycle", dict[hash]);
            return { first: dict[hash], last: n };
            break;
          } else {
            dict[hash] = n;
          }
        }
      }
    };

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541];
    const createHash = () => {
      let rowHash = 0;
      for (let i = 0; i < map.length; i++) {
        rowHash += map[i].map((k, j) => (k.rock === "O" ? j * primes[j % primes.length] : 0)).reduce((a, b) => a + b) * primes[i % primes.length];
      }

      /*for (let i = 0; i < map.length; i++) {
        rowHash += map[i].map((e) => e.rock).join("");
      } */

      return rowHash;
    };

    const result = runCycle(100000, true);
    const cycleLength = result.last - result.first;
    console.log(cycleLength);

    const totalIterations = 1000000000;

    const kvar = totalIterations - result.last;
    const numCycles = Math.floor((totalIterations - result.last) / cycleLength);

    const cycles = totalIterations - result.last - numCycles * cycleLength;

    // nånting -> 3

    console.log("--------------------");
    //console.log(cycles);
    runCycle(cycles, false);

    console.log("Run ", cycles);

    //return;

    let load = 0;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x].rock === "O") {
          load += map.length - y;
        }
      }
    }
    console.log(load);
  }
};
