const Parser = require("../common/parser.js");

class Box {
  constructor(id) {
    this.id = id;
    this.lenses = [];
  }

  addLens(lens) {
    const existingLens = this.lenses.find((l) => l.label === lens.label);
    if (!existingLens) {
      // Insert lens at the end of the list
      this.lenses.push(lens);
    } else {
      const index = this.lenses.indexOf(existingLens);
      // Replace the lens
      this.lenses.splice(index, 1, lens);
    }
  }

  removeLens(lensLabel) {
    const existingLens = this.lenses.find((l) => l.label === lensLabel);
    if (!existingLens) return;

    // Remove the lens
    this.lenses.splice(this.lenses.indexOf(existingLens), 1);
  }

  getFocusingPower(lensLabel) {
    const existingLens = this.lenses.find((l) => l.label === lensLabel);
    const index = this.lenses.indexOf(existingLens);
    return (index + 1) * existingLens.focalLength;
  }

  getBoxPower() {
    let power = 0;
    for (let i = 0; i < this.lenses.length; i++) {
      const existingLens = this.lenses[i];
      power += (this.id + 1) * (i + 1) * existingLens.focalLength;
    }
    return power;
  }
}

class Instruction {
  constructor(raw) {
    this.hash = getHash(raw);
    this.label = "";

    if (raw.indexOf("=") >= 0) {
      this.type = "INSERT";
      const parts = raw.split("=");
      this.label = parts[0];
      this.box = getHash(this.label);
      this.focalLength = parseInt(parts[1]);

      this.lens = { label: this.label, focalLength: this.focalLength };
    } else if (raw.indexOf("-") >= 0) {
      this.type = "REMOVE";
      const parts = raw.split("-");
      this.label = parts[0];
      this.box = getHash(this.label);
    }
  }
}

const getHash = (str) => {
  let value = 0;
  str
    .split("")
    .filter((v) => v.trim() !== "")
    .forEach((c) => {
      value += c.charCodeAt(0);
      value *= 17;
      value %= 256;
    });
  return value;
};

const printBoxes = (boxes) => {
  let boxesWithContent = boxes.filter((b) => b.lenses.length > 0);
  boxesWithContent.forEach((box) => {
    console.log(`Box ${box.id}`, box.lenses.map((l) => `[${l.label} ${l.focalLength}]`).join(","));
  });
};

module.exports = class Day {
  static run() {
    const data = Parser.readRaw(__dirname, false).split(",");

    const instructions = [];
    data.forEach((value) => {
      instructions.push(new Instruction(value));
    });

    console.log(
      "Part 1",
      instructions.map((i) => i.hash).reduce((a, b) => a + b)
    );

    // Part 2
    const boxes = [];
    for (let i = 0; i < 256; i++) {
      boxes.push(new Box(i));
    }

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (instruction.type === "INSERT") {
        const lens = instruction.lens;
        boxes[instruction.box].addLens(lens);
        continue;
      }

      if (instruction.type === "REMOVE") {
        boxes[instruction.box].removeLens(instruction.label);
        continue;
      }
    }

    printBoxes(boxes);

    let totalPower = 0;
    boxes.forEach((box) => {
      totalPower += box.getBoxPower();
    });
    console.log("Part 2", totalPower);
  }
};
