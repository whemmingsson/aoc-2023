const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, true, [
      {
        type: "array",
        valueType: "string",
        delimiter: "",
      },
    ]);

    const grid = [];

    let counter = 1;
    data.forEach((r, i) => {
      grid[i] = [];
      r.forEach((c, j) => {
        if (c === "#") {
          grid[i].push(counter);
          counter++;
        } else {
          grid[i].push("."); // Empty space
        }
      });
    });

    console.log(grid);

    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    const getRow = (r) => {
      if (r >= 0 && r < grid.length) return grid[r];
      throw Error("Tried to get row outside of grid");
    };

    const getColumn = (c) => {
      const col = [];
      for (let i = 0; i < gridHeight; i++) {
        col.push(grid[i][c]);
      }
      return col;
    };

    const drawGrid = () => {
      console.log("GRID");
      for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(""));
      }
    };

    drawGrid();
  }
};
