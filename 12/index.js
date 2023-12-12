module.exports = class Day {
  static run() {
    const row = "?###???????? 3,2,1";
    const validMap = ".###.##.#...";

    const parseMap = (r) => {
      return r;
    };

    const parseGroups = (g) => {
      return g
        .split(",")
        .map((v) => v.trim())
        .map((v) => parseInt(v));
    };

    const parseRow = (row) => {
      const p = row.split(" ");
      const map = parseMap(p[0]);
      const groups = parseGroups(p[1]);
      return { map, groups };
    };

    const validArrangement = (r) => {
      if (r.map.indexOf("?") >= 0) return false;

      const mapGroups = r.map
        .split(".")
        .filter((v) => v !== "")
        .map((v) => v.length);

      if (mapGroups.length !== r.groups.length) return false;

      for (let i = 0; i < mapGroups.length; i++) {
        if (mapGroups[i] !== r.groups[i]) return false;
      }

      return true;
    };

    const countValidArrangements = (r) => {
      // Construct all arrangements
      const unknownIndecies = [];
      for (let i = 0; i < r.map.length; i++) {
        if (r.map[i] === "?") unknownIndecies.push(i);
      }
      console.log(unknownIndecies);
      // Validate all arrangement (count # of valid ones)
      // Return count
    };

    // Test functionality
    const r = parseRow(row);
    //console.log(validArrangement(r));

    countValidArrangements(r);

    // Lab
    const options = ["A", "B"];
    const str = "x|x";
    const indicies = [0, 2];
  }
};
