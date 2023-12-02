const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "array",
        valueType: "string",
        delimiter: " ",
      },
    ]);

    // PART I
    const isValid = (passPhrase) => {
      for (let i = 0; i < passPhrase.length; i++) {
        const pw1 = passPhrase[i].trim();

        for (let j = i + 1; j < passPhrase.length; j++) {
          const pw2 = passPhrase[j].trim();
          if (pw1 === pw2) {
            return false;
          }
        }
      }

      return true;
    };

    let result = data.filter((v) => isValid(v));
    console.log(result.length);

    // PART II
    const areAnagrams = (a, b) => {
      if (a.length !== b.length) return false;

      let aSorted = a.split("").sort().join();
      let bSorted = b.split("").sort().join();

      if (aSorted === bSorted) return true;

      return false;
    };

    const isValidV2 = (passPhrase) => {
      for (let i = 0; i < passPhrase.length; i++) {
        const pw1 = passPhrase[i].trim();

        for (let j = i + 1; j < passPhrase.length; j++) {
          const pw2 = passPhrase[j].trim();
          if (pw1 === pw2 || areAnagrams(pw1, pw2)) {
            return false;
          }
        }
      }

      return true;
    };

    result = data.filter((v) => isValidV2(v));
    console.log("Part 2", result.length);
  }
};
