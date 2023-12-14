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

      console.log("  Starting finding vertical reflection");

      while (right == left && right && left) {
        console.log("    --");
        console.log("    LEFT: ", left);
        console.log("    RIGHT:", right);
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

      console.log("  Starting finding horizontal reflection", top, bottom);

      while (top == bottom && i >= 0 && j <= m.length - 1) {
        console.log("    --");
        console.log("    TOP: ", top);
        console.log("    BTM:", bottom);
        i--;
        j++;
        top = getRow(m, i);
        bottom = getRow(m, j);
      }

      console.log("    *--");
      console.log("    TOP: ", top);
      console.log("    BTM:", bottom);

      if (top == bottom || top == "" || bottom == "") {
        return true;
      }
    };
    let sum = 0;
    maps.forEach((m, n) => {
      console.log("Inspecting map", n);
      // Find using columns
      for (let i = 0; i < m[0].length - 1; i++) {
        let currentCol = getColumn(m, i);
        let nextCol = getColumn(m, i + 1);
        if (currentCol == nextCol) {
          const isMirror = isVerticalMirror(m, i, i + 1);
          if (isMirror) {
            console.log(" MIRROR FOUND - Columns to the left:", m[0].length - i);
            sum += m[0].length - i;
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
            console.log("MIRROR FOUND - Rows above x 100", (m.length - i) * 100);
            sum += (m.length - i) * 100;
          }
        }
      }

      console.log("----------------------");
    });

    console.log(sum);
  }
};
