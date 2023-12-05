const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "array",
        delimiter: "; ",
        valueType: "string",
      },
    ]);

    // Cleanup data
    const result = [];
    data.forEach((element) => {
      const game = [];
      element.forEach((e) => {
        if (e.includes(":")) {
          game.push(e.split(":").slice(1).join("").trim());
        } else {
          game.push(e);
        }
      });
      result.push(game);
    });

    const maxRed = 12;
    const maxGreen = 13;
    const maxBlue = 14;

    const isValid = (color, count) => {
      switch (color) {
        case "red":
          return count <= maxRed;
        case "green":
          return count <= maxGreen;
        case "blue":
          return count <= maxBlue;
      }
    };

    let gameIdSum = 0;
    let powerSum = 0;
    result.forEach((game, i) => {
      const gameId = i + 1;
      let gameValid = true;

      let mRed = 0,
        mGreen = 0,
        mBlue = 0;
      game.forEach((round, r) => {
        const cubes = round.split(",").map((v) => v.trim());

        let roundValid = true;
        for (let j = 0; j < cubes.length; j++) {
          const p = cubes[j].split(" ");
          const count = parseInt(p[0]);
          const color = p[1];
          const valid = isValid(color, count);
          switch (color) {
            case "red":
              if (count > mRed) mRed = count;
              break;
            case "green":
              if (count > mGreen) mGreen = count;
              break;
            case "blue":
              if (count > mBlue) mBlue = count;
              break;
          }

          if (!valid) {
            roundValid = false;
          }
        }
        if (!roundValid) gameValid = false;
      });

      let gamePower = mRed * mGreen * mBlue;
      powerSum += gamePower;

      console.log("Game ", gameId, gameValid ? "valid" : "invalid");
      console.log("Game ", gameId, gamePower);

      if (gameValid) {
        gameIdSum += gameId;
      }
    });

    console.log("Part 1", gameIdSum);
    console.log("Part 2", powerSum);
  }
};
