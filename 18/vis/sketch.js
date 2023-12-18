const instructions = [];
const trenchList = [];
const trenchMap = {};

let currentInstruction = null;
let i = 0;
let diggerX;
let diggerY;

let holeWidth = 1;
let holeHeight = 1;

let speed = 5;

const getColor = (focalLength) => {
  return new hsbColor(map(focalLength, 0, 9, 0, 360), 250, 320);
};

const getDelta = (d) => {
  switch (d) {
    case "U":
      return { x: 0, y: -holeHeight };
    case "R":
      return { x: holeWidth, y: 0 };
    case "D":
      return { x: 0, y: holeHeight };
    case "L":
      return { x: -holeWidth, y: 0 };
    default:
      throw Error(d + " is not a valid direction");
  }
};

function setup() {
  const canvas = createCanvas(1000, 1000);
  // frameRate(2);
  canvas.parent("sketch");

  const rows = data.split("\n");

  const rgx = /([UDLR])\s(\d+)\s\((#[a-f\d]+)\)/;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]; // D 5 (#0dc571)

    const matches = r.match(rgx);
    instructions.push({ direction: matches[1], count: parseInt(matches[2]), color: matches[3] });
  }

  console.log(instructions);

  diggerX = 200;
  diggerY = height - 300;
}

function mousePressed() {
  //loop();
}

function draw() {
  for (let n = 0; n < speed; n++) {
    background(255);
    currentInstruction = instructions[i];
    const delta = getDelta(currentInstruction.direction);
    const color = currentInstruction.color;
    let tempX = diggerX;
    let tempY = diggerY;
    for (let n = 0; n < currentInstruction.count; n++) {
      const hole = { x: tempX, y: tempY, color: color };
      const key = `${tempX}_${tempY}`;

      if (!trenchMap[key]) {
        trenchList.push(hole);
        trenchMap[key] = hole;
      }

      tempX += delta.x;
      tempY += delta.y;
    }

    diggerX = tempX;
    diggerY = tempY;

    i++;

    if (i >= instructions.length) {
      noLoop();
      console.log("Done!");
      break;
    }
  }

  trenchList.forEach((h) => {
    fill(0);
    rect(h.x, h.y, holeWidth, holeHeight);
  });
}
