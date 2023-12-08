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
      const diff = (a, b) => {
        return a.filter((n) => !b.includes(n));
      };
      const hasXOfKind = (cards, x) => {
        for (let i = 0; i < cards.length; i++) {
          let card = cards[i];
          const matches = cards.filter((c) => c === card || c === "J");
          if (matches.length === x) return { usedCards: matches };
        }
        return null;
      };

      const cards = hand.split("");

      if (hasXOfKind(cards, 5)) return handTypes[0];
      if (hasXOfKind(cards, 4)) return handTypes[1];

      const three = hasXOfKind(cards, 3);
      if (three && hasXOfKind(diff(cards, three.usedCards), 2)) {
        return handTypes[2];
      }

      if (hasXOfKind(cards, 3)) return handTypes[3];

      const pair = hasXOfKind(cards, 2);
      if (pair) {
        if (hasXOfKind(diff(cards, pair.usedCards), 2)) return handTypes[4];
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
    data.forEach((v) => (v.score = v.bid * v.rank));
    const sum = data.map((c) => c.score).reduce((a, b) => a + b);
    console.log(data);
    console.log(sum);
  }
};
