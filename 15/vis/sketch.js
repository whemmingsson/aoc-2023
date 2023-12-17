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

class hsbColor {
  constructor(h, s, b) {
    this.h = h;
    this.s = s;
    this.b = b;
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

const instructions = [];
const boxes = [];
let i = 0;
let maxI = -1;
const speed = 2;
function setup() {
  const canvas = createCanvas(1700, 600);
  canvas.parent("sketch");
  colorMode(HSB, 360);

  data.split(",").forEach((value) => {
    instructions.push(new Instruction(value));
  });

  for (let i = 0; i < 256; i++) {
    boxes.push(new Box(i));
  }

  maxI = instructions.length;
  noLoop();
}


function mousePressed() {
  loop();
}

const boxHeight = 32 * 2;
const emptyBoxWidth = 47;
const lensWidth = 5;
const margin = 5;
const lensMargin = 1;

const getColor = (focalLength) => {
  return new hsbColor(map(focalLength, 0, 9, 0, 360), 250, 320);
}

function draw() {
  background(0);
  boxes.forEach((box, i) => {
    let x = margin + (i % (boxHeight / 2)) * emptyBoxWidth + margin * (i % (boxHeight / 2));
    let y = margin + Math.floor(i / (boxHeight / 2)) * boxHeight + margin * Math.floor(i / (boxHeight / 2));

    push();
    translate(x + emptyBoxWidth / 2, y + boxHeight / 2);
    textSize(22);
    fill(40);
    stroke(40);
    textAlign(CENTER, CENTER);
    rotate(-HALF_PI / 2);
    text(box.id + "", -0, 0);
    pop();

    noStroke();
    if (box.lenses.length > 0) {
      box.lenses.forEach((lens, j) => {
        let c = getColor(lens.focalLength);
        fill(c.h, c.s, c.b);
        rect(1 + x + j * lensWidth + lensMargin * j * lensWidth, y, lensWidth, boxHeight);
      });
    }

    noFill();
    stroke(120);
    rect(x, y, emptyBoxWidth, boxHeight);

  });

  for (let n = 0; n < speed; n++) {
    const instruction = instructions[i];

    if (instruction.type === "INSERT") {
      const lens = instruction.lens;
      boxes[instruction.box].addLens(lens);
    }

    if (instruction.type === "REMOVE") {
      boxes[instruction.box].removeLens(instruction.label);
    }

    i++;

    if (i >= maxI) {
      noLoop();
    }
  }


}

