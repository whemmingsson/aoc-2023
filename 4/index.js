const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);

    const extractNumbers = (str) => {
      return str
        .split(" ")
        .filter((v) => v != "" && v != " ")
        .map((v) => v.trim())
        .map((v) => parseInt(v));
    };

    const countNumberOfMatches = (winning, numbers) => {
      let count = 0;
      winning.forEach((wNr) => {
        if (numbers.includes(wNr)) count++;
      });
      return count;
    };

    const getCardScore = (numMatches) => {
      return Math.pow(2, numMatches - 1);
    };

    const scratchCards = [];
    data.split("\n").forEach((line) => {
      const parts = line.split(":");
      const cardNr = parseInt(parts[0].replace("   ", " ").replace("  ", " ").split(" ")[1]);
      const numberParts = parts[1].split(" | ");
      const winningNumbers = extractNumbers(numberParts[0]);
      const cardNumbers = extractNumbers(numberParts[1]);
      scratchCards.push({ id: cardNr, winningNumbers, cardNumbers, matches: countNumberOfMatches(winningNumbers, cardNumbers) });
    });

    scratchCards.forEach((card) => {
      card.score = card.matches > 0 ? getCardScore(card.matches) : 0;
    });

    const lookup = {};
    scratchCards.forEach((card) => {
      lookup[card.id] = { matches: card.matches, count: 1 };
    });

    Object.keys(lookup).forEach((k) => {
      const c = lookup[k];
      for (let i = 1; i < c.matches + 1; i++) {
        let id = parseInt(k) + i;
        if (lookup[id]) {
          lookup[id].count += c.count;
        }
      }
    });

    const totalScore = scratchCards.map((c) => c.score).reduce((a, b) => a + b);

    let sum = 0;
    Object.keys(lookup).forEach((k) => {
      sum += lookup[k].count;
    });

    console.log("Part 1:", totalScore);
    console.log("Part 2:", sum);
  }
};
