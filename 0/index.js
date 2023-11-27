const Parser = require("../common/parser.js");
const r = require("../common/regexUtils.js");
module.exports = class Day {
  static run() {
    const data = Parser.parse(__dirname, false, [
      {
        regex: `${r.S},${r.I},${r.F}`,
        props: ["elfName", "elfWeight", "elfAge"],
      },
      {
        regex: `${r.F}\\|${r.I}`,
        props: ["flo", "int"],
      },
      {
        regex: `${r.S}\\|${r.F},${r.I},${r.I}:${r.S}`,
        props: ["a", "b", "c", "d", "e"],
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
