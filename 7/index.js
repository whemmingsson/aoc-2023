const Parser = require("../common/parser.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "regex",
        regex: "([A-Z\\d]+) (\\d+)",
        props: ["hand", "bid"],
      },
    ]);

    // Workaround an annoying bug in the parser
    data.forEach((h) => {
      if (parseInt(h.hand) == h.hand) h.hand += "";
      h.cards = h.hand.split("");
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
          if (cards.filter((c) => c === card || c === "J").length === x) return { has: true, card: card };
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

    const cardValues = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
    const cardValuesPart2 = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
    cardValues.reverse();
    cardValuesPart2.reverse();

    // Order by strength
    data.sort((a, b) => {
      if (a.type === b.type) {
        const valueOf = (a) => {
          return cardValuesPart2.indexOf(a);
        };
        // Order by card comparison
        let i = 0;
        while (a.cards[i] === b.cards[i]) {
          i++;
        }

        const va = valueOf(a.cards[i]);
        const vb = valueOf(b.cards[i]);

        return va < vb ? 1 : -1;
      }

      return handTypes.indexOf(a.type) > handTypes.indexOf(b.type) ? 1 : -1;
    });

    data.reverse();
    data.forEach((v, i) => (v.rank = i + 1));

    console.log(data);
    const sum = data.map((v) => v.bid * v.rank).reduce((a, b) => a + b);

    console.log(sum);
  }
};
