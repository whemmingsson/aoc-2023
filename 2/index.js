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

    // Tranform data
    // only 12 red cubes, 13 green cubes, and 14 blue cubes?
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
      //console.log("Inspecing game", gameId, game);
      let gameValid = true;

      let mRed = 0,
        mGreen = 0,
        mBlue = 0;
      game.forEach((round, r) => {
        //console.log("  " + round);
        const cubes = round.split(",").map((v) => v.trim());
        //console.log("   ", cubes);

        let roundValid = true;
        for (let j = 0; j < cubes.length; j++) {
          let cube = cubes[j];
          const p = cube.split(" ");
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

          //console.log(color, count, valid);
          if (!valid) {
            roundValid = false;
          }
        }
        //console.log("    Round ", r, roundValid ? "valid" : "invalid");
        if (!roundValid) gameValid = false;
      });

      console.log("Game ", gameId, gameValid ? "valid" : "invalid");

      let gamePower = mRed * mGreen * mBlue;

      console.log("Game", gameId, gamePower);
      powerSum += gamePower;

      if (gameValid) {
        gameIdSum += gameId;
      }
    });

    console.log("Part 1", gameIdSum);
    console.log("Part 2", powerSum);
  }
};
