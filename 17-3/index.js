const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    // PART ONE
    /*const target = 27;

    let counter = 1;
    let squareSize = 0;
    while (true) {
      squareSize = Math.pow(counter, 2); // Size of the square. Also the bottom right number (corner).
      if (squareSize >= target) {
        break;
      }
      counter += 2;
    }

    const distanceReducer = counter - 1;
    const blCorner = squareSize - distanceReducer;
    const tlCorner = blCorner - distanceReducer;
    const trCorner = tlCorner - distanceReducer;

    const calculteMiddle = (corner) => {
      return corner - distanceReducer / 2;
    };

    const calcDist = (corner) => {
      return Math.floor(counter / 2) + Math.abs(target - calculteMiddle(corner));
    };

    let dist;
    if (target === squareSize || target === blCorner || target === tlCorner || target === trCorner) {
      dist = distanceReducer;
    } else if (target < trCorner) {
      dist = calcDist(trCorner);
    } else if (target < tlCorner) {
      dist = calcDist(tlCorner);
    } else if (target < blCorner) {
      dist = calcDist(blCorner);
    } else if (target < squareSize) {
      dist = calcDist(squareSize);
    }
    return console.log("Distance:", dist); */

    // PART II
    /* R1, U1, L2, D2, R3, U3, L4, D4, R5, U5 */
    const target = 361527;
    const values = [];
    const dict = [];
    let pos = { x: 0, y: 0 };
    let currentDir = "R";
    let stepSize = 1;

    const nextDir = (c) => {
      if (c === "R") return "U";
      if (c === "U") return "L";
      if (c === "L") return "D";
      if (c === "D") return "R";
    };

    const nextPos = (x, y, d) => {
      if (d === "R") return { x: x + 1, y: y };
      if (d === "U") return { x: x, y: y - 1 };
      if (d === "L") return { x: x - 1, y: y };
      if (d === "D") return { x: x, y: y + 1 };
    };

    const getValueAt = (key) => {
      let v = dict[key];

      if (v) console.log("Found value at key", key, v);
      if (v) return v;

      return 0;
    };

    const keyOf = (x, y) => {
      return `${x}_${y}`;
    };

    const calcValue = (pos) => {
      let sum = 0;
      sum += getValueAt(keyOf(pos.x - 1, pos.y - 1));
      sum += getValueAt(keyOf(pos.x - 1, pos.y));
      sum += getValueAt(keyOf(pos.x - 1, pos.y + 1));
      sum += getValueAt(keyOf(pos.x, pos.y - 1));
      sum += getValueAt(keyOf(pos.x, pos.y + 1));
      sum += getValueAt(keyOf(pos.x + 1, pos.y - 1));
      sum += getValueAt(keyOf(pos.x + 1, pos.y));
      sum += getValueAt(keyOf(pos.x + 1, pos.y + 1));
      return sum;
    };

    dict["0_0"] = 1;

    while (true) {
      let valueFound = 0;
      for (let i = 0; i < stepSize; i++) {
        // Move to next cell
        let p = nextPos(pos.x, pos.y, currentDir);
        pos.x = p.x;
        pos.y = p.y;

        // Calculate value
        let v = calcValue(pos);

        if (v >= target) {
          valueFound = v;
          break;
        }

        // Update datastructure
        dict[keyOf(pos.x, pos.y)] = v;
      }

      if (valueFound) {
        console.log(valueFound);
        break;
      }

      currentDir = nextDir(currentDir);

      if (currentDir === "R" || currentDir === "L") {
        stepSize++;
      }
    }

    console.log("Done");
  }
};
