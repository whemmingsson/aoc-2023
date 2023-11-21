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
