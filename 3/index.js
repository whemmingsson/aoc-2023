const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);

    const isNumber = (v) => parseInt(v) == v;

    const schematic = [];

    let width = 0;
    data.split("\n").forEach((row) => {
      let schemaRow = [];
      row.split("").forEach((s) => schemaRow.push(s));
      schematic.push(schemaRow);
      width = schemaRow.length;
    });
    const height = schematic.length;

    const getNumber = (row, pos, dir) => {
      let number = "";
      let i = pos;
      if (dir === "R" || dir === "L") {
        while (isNumber(row[i])) {
          if (dir === "R") {
            number += row[i];
            i++;
          } else if (dir === "L") {
            number = row[i] + number;
            i--;
          }
        }
        return number;
      } else {
        let i = pos;
        // Move back
        while (isNumber(row[i])) {
          i--;
        }
        i++;
        let number = "";
        while (isNumber(row[i])) {
          number += row[i];
          i++;
        }

        return number;
      }
    };

    let sum = 0;
    let gearNumberSum = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let symbol = schematic[y][x];

        let gearParts = [];
        if (symbol === "." || isNumber(symbol)) {
          continue;
        }

        const isGearSymbol = symbol === "*";

        // LEFT
        if (isNumber(schematic[y][x - 1])) {
          const number = getNumber(schematic[y], x - 1, "L");
          console.log(number);
          sum += parseInt(number);

          if (isGearSymbol) {
            gearParts.push(number);
          }
        }
        // RIGHT
        if (isNumber(schematic[y][x + 1])) {
          const number = getNumber(schematic[y], x + 1, "R");
          console.log(number);
          sum += parseInt(number);
          if (isGearSymbol) {
            gearParts.push(number);
          }
        }
        // TOP
        if (schematic[y - 1]) {
          if (isNumber(schematic[y - 1][x])) {
            // Directly below
            const number = getNumber(schematic[y - 1], x);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }
          if (!isNumber(schematic[y - 1][x]) && isNumber(schematic[y - 1][x - 1])) {
            const number = getNumber(schematic[y - 1], x - 1);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }
          if (!isNumber(schematic[y - 1][x]) && isNumber(schematic[y - 1][x + 1])) {
            const number = getNumber(schematic[y - 1], x + 1);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }
        }

        // BOTTOM
        if (schematic[y + 1]) {
          if (isNumber(schematic[y + 1][x])) {
            const number = getNumber(schematic[y + 1], x);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }

          if (!isNumber(schematic[y + 1][x]) && isNumber(schematic[y + 1][x - 1])) {
            const number = getNumber(schematic[y + 1], x - 1);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }

          if (!isNumber(schematic[y + 1][x]) && isNumber(schematic[y + 1][x + 1])) {
            const number = getNumber(schematic[y + 1], x + 1);
            console.log(number);
            sum += parseInt(number);

            if (isGearSymbol) {
              gearParts.push(number);
            }
          }
        }

        if (gearParts.length === 2) {
          const gearNumber = gearParts.reduce((m, n) => m * n);
          console.log(gearNumber);
          gearNumberSum += gearNumber;
        }
      }
    }

    console.log("Part 1", sum);
    console.log("Part 2", gearNumberSum);
  }
};
