const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        type: "regex",
        regex: `${regex.S},${regex.I},${regex.F}`,
        props: ["elfName", "elfWeight", "elfAge"],
      },
      {
        type: "regex",
        regex: `${regex.F}\\|${regex.I}`,
        props: ["flo", "int"],
      },
      {
        type: "regex",
        regex: `${regex.S}\\|${regex.F},${regex.I},${regex.I}:${regex.S}`,
        props: ["a", "b", "c", "d", "e"],
      },
      {
        type: "array",
        delimiter: " ",
        valueType: "INT",
      },
    ]);
    console.log(data);
  }
};

/* Example data 

text,10,100.10
19.5|10
a string here|19.1,10,100:another string
18.0,10,hejsan unparsable line
191.5|10100
0.00001|99.123
text hejsan hoppsan,999,0.10
unparsable,999,10

*/
