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

    const grid = [];
    const galaxies = [];

    /// SETUP
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

    let gridHeight = grid.length;
    let gridWidth = grid[0].length;
    /// END SETUP

    const allEmptySpace = (line) => {
      return line.every((l) => l === ".");
    };

    const drawGrid = () => {
      console.log("GRID");
      for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(""));
      }
    };

    const getRowsToExpand = () => {
      const rows = [];
      for (let i = 0; i < gridHeight; i++) {
        if (allEmptySpace(getRow(i))) {
          rows.push(i);
        }
      }
      return rows;
    };

    const getColumnsToExpand = () => {
      const cols = [];
      for (let i = 0; i < gridWidth; i++) {
        if (allEmptySpace(getColumn(i))) {
          cols.push(i);
        }
      }
      return cols;
    };

    const getRow = (r) => {
      if (r >= 0 && r < grid.length) return grid[r];
      throw Error("Tried to get row outside of grid");
    };

    const getColumn = (c) => {
      const col = [];
      for (let i = 0; i < gridHeight; i++) {
        if (!grid[i][c]) {
          throw Error("Tried to get column value outside of grid");
        }
        col.push(grid[i][c]);
      }
      return col;
    };

    const findGalaxies = () => {
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (grid[y][x] !== ".") {
            galaxies.push({ id: grid[y][x], x: x, y: y });
          }
        }
      }
    };

    const calculateDistances = () => {
      const distance = (g1, g2) => {
        return Math.abs(g2.x - g1.x) + Math.abs(g2.y - g1.y);
      };

      const distances = [];

      galaxies.forEach((galaxy, i) => {
        for (let j = i; j < galaxies.length; j++) {
          if (j === i) continue;
          const other = galaxies[j];
          const d = distance(galaxy, other);
          distances.push(d);
        }
      });

      console.log(distances.reduce((a, b) => a + b));
    };

    const partOne = () => {
      gridHeight = grid.length;
      gridWidth = grid[0].length;

      const rowsToDuplicate = getRowsToExpand();
      const columnsToDuplicate = getColumnsToExpand();

      const duplicateRows = (rows) => {
        console.log("Expanding height...");
        for (let i = rows.length - 1; i >= 0; i--) {
          for (let n = 0; n < expansionFactor; n++) {
            grid.splice(rows[i], 0, new Array(gridWidth).fill("."));
          }
        }
        gridHeight += rows.length * expansionFactor;
      };

      const duplicateColumns = (cols) => {
        console.log("Expanding width...");
        for (let i = cols.length - 1; i >= 0; i--) {
          const idxToDuplicate = cols[i];
          for (let j = gridHeight - 1; j >= 0; j--) {
            for (let n = 0; n < expansionFactor; n++) {
              grid[j].splice(idxToDuplicate, 0, ".");
            }
          }
        }

        gridWidth += cols.length * expansionFactor;
      };

      duplicateRows(rowsToDuplicate);
      duplicateColumns(columnsToDuplicate);
      findGalaxies();
      calculateDistances();
    };

    const partTwo = () => {
      findGalaxies();
      const f = 999999;

      const expand = (s, a) => {
        s.forEach((c, i) => {
          galaxies.filter((g) => g[a] > c + 999999 * i).forEach((g) => (g[a] += f));
        });
      };

      expand(getRowsToExpand(), "y");
      expand(getColumnsToExpand(), "x");
      calculateDistances();
    };

    //partOne();
    partTwo();
  }
};
