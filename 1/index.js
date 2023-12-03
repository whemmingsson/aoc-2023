const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false);

    const lines = data.split("\n");
    console.log(lines);

    let sum = 0;
    lines.forEach((line) => {
      const chars = line.split("");
      const isNumber = (v) => parseInt(v) == v;

      let resultStr = "";
      for (let i = 0; i < chars.length; i++) {
        let c = chars[i];
        if (isNumber(c)) {
          resultStr += c;
          break;
        }
      }

      for (let i = chars.length - 1; i >= 0; i--) {
        let c = chars[i];
        if (isNumber(c)) {
          resultStr += c;
          break;
        }
      }

      const lineNumber = parseInt(resultStr);
      sum += lineNumber;
    });

    console.log("Part 1", sum);

    // Part II
    const validWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

    const reverse = (word) => {
      return word.split("").reverse().join("");
    };

    const validWordsInverted = validWords.map((w) => reverse(w));
    console.log(validWordsInverted);
    const isNumber = (v) => parseInt(v) == v;
    const canBeValidWord = (str) => {
      if (!str) return false;
      return validWords.filter((w) => w.substring(0, str.length) === str).length > 0;
    };
    const isValidWord = (str) => {
      return validWords.indexOf(str) >= 0;
    };
    const getDigitFromWord = (word) => validWords.indexOf(word) + 1;

    const canBeValidWordInv = (str) => {
      if (!str) return false;
      return validWordsInverted.filter((w) => w.substring(0, str.length) === str).length > 0;
    };
    const isValidWordInv = (str) => {
      return validWordsInverted.indexOf(str) >= 0;
    };

    const getDigitFromWordInv = (word) => validWordsInverted.indexOf(word) + 1;

    sum = 0;
    lines.forEach((line) => {
      const chars = line.split("");

      // Find the first digit;
      let resultStr = "";
      for (let i = 0; i < chars.length; i++) {
        let v = chars[i];
        if (isNumber(v)) {
          resultStr += v;
          break;
        } else if (canBeValidWord(v)) {
          // Beginning of word.
          let word = "";
          let j = i;
          while (word === "" || (canBeValidWord(word) && j < chars.length)) {
            let tmpWord = word + chars[j];

            if (!canBeValidWord(tmpWord)) break;
            word = tmpWord;
            j++;
          }

          if (isValidWord(word)) {
            resultStr += getDigitFromWord(word);
            //console.log("First digit:", resultStr);
            break;
          } else {
          }

          //i += j;
        }
      }

      // Find the last word.
      for (let i = chars.length - 1; i >= 0; i--) {
        let v = chars[i];
        if (isNumber(v)) {
          resultStr += v;
          break;
          //console.log("Second digit:", v);
        } else if (canBeValidWordInv(v)) {
          //console.log("Beginning word with:", v);
          // Beginning of word.
          let word = "";
          let j = i;
          while (word === "" || (canBeValidWordInv(word) && j >= 0)) {
            let tmpWord = word + chars[j];

            //console.log("Inspecting word", tmpWord);

            if (!canBeValidWordInv(tmpWord)) break;
            word = tmpWord;
            j--;
          }

          if (isValidWordInv(word)) {
            resultStr += getDigitFromWordInv(word);
            // console.log("Second digit:", getDigitFromWordInv(word));
            break;
          }

          //i += j;
        }
      }

      console.log(resultStr);
      sum += parseInt(resultStr);
    });

    console.log("Part 2", sum);
  }
};
