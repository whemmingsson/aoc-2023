const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, true, [
      {
        type: "regex",
        regex: "([A-Z\\d]+) (\\d+)",
        props: ["hand", "bid"],
      },
    ]);

    // Workaround an annoying bug in the parser
    data.forEach((h) => {
      if (parseInt(h.hand) == h.hand) h.hand += "";
    });

    console.log(data);
    const handTypes = ["FIVE", "FOUR", "FULLHOUSE", "THREEOFKIND", "TWOPAIR", "ONEPAIR", "HIGHCARD"];

    const determineHandType = (hand) => {
      const hasXOfKind = (x, notCard) => {
        for (let i = 0; i < cards.length; i++) {
          if (notCard && cards[i] === notCard) {
            continue;
          }
          let card = cards[i];
          if (cards.filter((c) => c === card).length === x) return { has: true, card: card };
        }
        return false;
      };

      const cards = hand.split("");

      if (hasXOfKind(5)) return handTypes[0];
      if (hasXOfKind(4)) return handTypes[1];

      // Full house
      const three = hasXOfKind(3);
      if (three.has) {
        const two = hasXOfKind(2, three.card);
        if (two.has) return handTypes[2];
      }

      if (hasXOfKind(3).has) return handTypes[3];

      // Two pairs / one pair
      const p1 = hasXOfKind(2);
      if (p1.has) {
        const p2 = hasXOfKind(2, p1.card);
        if (p2.has) return handTypes[4];
        else return handTypes[5];
      }

      return handTypes[6];
    };

    data.forEach((d) => {
      d.type = determineHandType(d.hand);
    });

    // Order by strength
    data.sort((a, b) => {
      if (a.type === b.type) {
        // Order by card comparison
        return 0;
      }

      return handTypes.indexOf(a.type) > handTypes.indexOf(b.type) ? 1 : -1;
    });

    console.log(data);
  }
};
