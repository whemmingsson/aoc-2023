const Parser = require("../common/parser.js");

class Node {
  constructor(v, l) {
    this.value = v;
    this.level = l;
    this.index = 100;
  }
}

module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "array",
        delimiter: " ",
        valueType: "int",
      },
    ]);

    let nodes = [];

    const getAllNodesOnLevel = (level) => {
      return nodes.filter((n) => n.level === level);
    };

    const getNodeValues = (n) => {
      return n.map((n) => n.value);
    };

    const isZeroRow = (n) => {
      return getNodeValues(n).every((v) => v === 0);
    };

    const maxLevel = () => {
      return Math.max(...nodes.map((n) => n.level));
    };

    const getLastInLevel = (level) => {
      let nodes = getAllNodesOnLevel(level);
      return nodes[nodes.length - 1];
    };

    const getFirstInLevel = (level) => {
      return getAllNodesOnLevel(level)[0];
    };

    const buildFirstLevel = (r) => {
      let nodes = [];
      for (let i = 0; i < data[r].length; i++) {
        nodes.push(new Node(data[r][i], 1));
      }
      return nodes;
    };

    const buildDiffLevels = () => {
      let row = getAllNodesOnLevel(1);
      let level = 2;
      do {
        for (let i = 0; i < row.length - 1; i++) {
          nodes.push(new Node(row[i + 1].value - row[i].value, level));
        }

        row = getAllNodesOnLevel(level);
        level++;
      } while (!isZeroRow(row));
    };

    const partOne = () => {
      let sum = 0;
      for (let r = 0; r < data.length; r++) {
        nodes = buildFirstLevel(r);
        buildDiffLevels();

        nodes.push(new Node(0, maxLevel()));
        for (let i = maxLevel() - 1; i >= 1; i--) {
          nodes.push(new Node(getLastInLevel(i).value + getLastInLevel(i + 1).value, i));
        }
        sum += getLastInLevel(1).value;
      }

      console.log("Part 1:", sum);
    };

    const partTwo = () => {
      let sum = 0;
      for (let r = 0; r < data.length; r++) {
        nodes = buildFirstLevel(r);
        buildDiffLevels();

        let zero = new Node(0, maxLevel());
        zero.index = -1;
        nodes.push(zero);
        for (let i = maxLevel() - 1; i >= 1; i--) {
          nodes = [new Node(getFirstInLevel(i).value - getFirstInLevel(i + 1).value, i), ...nodes];
        }
        sum += getFirstInLevel(1).value;
      }

      console.log("Part 2:", sum);
    };

    partOne();
    partTwo();
  }
};
