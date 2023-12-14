const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false).split("\n");
    console.log(data);

    const maps = [];

    let current = [];
    data.forEach((row) => {
      if (row.trim() !== "") {
        current.push(row);
      } else {
        maps.push(current);
        current = [];
      }
    });

    console.log("Maps:");
    console.log(maps);

    const getColumn = (m, c) => {
      let col = "";
      for (let i = 0; i < m.length; i++) {
        if (m[i][c]) col += m[i][c];
      }
      return col;
    };

    const getRow = (m, r) => {
      if (m[r]) return m[r];
      return "";
    };

    const isVerticalMirror = (m, i, j) => {
      let left = getColumn(m, i);
      let right = getColumn(m, j);

      while (right == left && right && left) {
        i--;
        j++;
        left = getColumn(m, i);
        right = getColumn(m, j);
      }

      if (right == left || right == "" || left == "") {
        return true;
      }
    };

    const isHorizontalMirror = (m, i, j) => {
      let top = getRow(m, i);
      let bottom = getRow(m, j);

      while (top == bottom && i >= 0 && j <= m.length - 1) {
        i--;
        j++;
        top = getRow(m, i);
        bottom = getRow(m, j);
      }

      if (top == bottom || top == "" || bottom == "") {
        return true;
      }
    };
    let sum = 0;
    let start = new Date();

    const findMirror = (m, prev) => {
      // Find using columns
      for (let i = 0; i < m[0].length - 1; i++) {
        let currentCol = getColumn(m, i);
        let nextCol = getColumn(m, i + 1);
        if (currentCol == nextCol) {
          const isMirror = isVerticalMirror(m, i, i + 1);
          if (isMirror) {
            //sum += i + 1;
            let k = "v_" + i;
            if (prev && k !== prev) {
              return k;
            }
            if (!prev) return k;
          }
        }
      }

      //Find using rows
      for (let i = 0; i < m.length - 1; i++) {
        let currentRow = getRow(m, i);
        let nextRow = getRow(m, i + 1);
        if (currentRow == nextRow) {
          const isMirror = isHorizontalMirror(m, i, i + 1);
          if (isMirror) {
            //sum += (i + 1) * 100;
            let k = "h_" + i;
            if (prev && k !== prev) {
              return k;
            }
            if (!prev) return k;
          }
        }
      }
      return "";
    };

    String.prototype.replaceAt = function (index, replacement) {
      return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    };

    sum = 0;
    maps.forEach((m, n) => {
      let mirror = null;
      console.log("Starting map", n);
      mirror = findMirror(m);
      console.log("Original mirror:", mirror);
      console.log(m);
      let foundNew = false;
      for (let a = 0; a < m.length; a++) {
        for (let b = 0; b < m[a].length; b++) {
          // Switch character

          if (m[a][b] === ".") m[a] = m[a].replaceAt(b, "#");
          else if (m[a][b] === "#") m[a] = m[a].replaceAt(b, ".");

          let newMirror = findMirror(m, mirror);
          if (newMirror) {
            console.log("Generated new mirror!", mirror, "-->", newMirror);
            console.log(m);
            const split = newMirror.split("_");
            const v = parseInt(split[1]);
            if (split[0] === "v") {
              sum += v + 1;
            } else {
              sum += (v + 1) * 100;
            }
            foundNew = true;
            break;
          }
          // Switch back character
          if (m[a][b] === ".") m[a] = m[a].replaceAt(b, "#");
          else if (m[a][b] === "#") m[a] = m[a].replaceAt(b, ".");
        }
        if (foundNew) {
          break;
        }
      }
    });

    console.log(new Date() - start);

    console.log(sum);
  }
};
