const instructions = [];
const trenchList = [];
const trenchMap = {};

let currentInstruction = null;
let i = 0;
let diggerX;
let diggerY;

let holeWidth = 4;
let holeHeight = 4;

let speed = 50;

let floodFill = false;
let floodInjectionPoint = { x: 0, y: 0 };
let tilesToFlood = [];

const k = (o) => `${o.x}_${o.y}`;

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

let running = false;

const mapToDirection = (value) => {
  switch (value) {
    case 0:
      return "R";
    case 1:
      return "D";
    case 2:
      return "L";
    case 3:
      return "U";
    default:
      throw Error(value + " is not a valid direction");
  }
}

function setup() {
  const canvas = createCanvas(1400, 1600);
  canvas.parent("sketch");

  const rows = data.split("\n");

  const rgx = /([UDLR])\s(\d+)\s\((#[a-f\d]+)\)/;
  for (let i = 0; i < rows.length; i++) {
    const matches = rows[i].match(rgx);
    let hex = matches[3];
    const direction = parseInt([hex[hex.length - 1]]);

    let hexNr = hex.substring(1, hex.length - 1);
    console.log(hexNr);

    instructions.push({ direction: mapToDirection(direction), count: parseInt(hexNr, 16), hex: hex });
  }
  diggerX = 200;
  diggerY = height - 400;

  console.log(instructions);

}

function mousePressed() {
  running = true;

  if (i >= instructions.length) {
    floodFill = true;
    floodInjectionPoint = { x: Math.floor(mouseX / holeWidth) * holeWidth, y: Math.floor(mouseY / holeHeight) * holeHeight };
    speed = 20;
    loop();
  }
  else {
    console.log("Not ready yet");
  }
}

function draw() {
  background(255);
  if (!running) {
    return;
  }
  if (!floodFill) {
    calculateBoundry();
  }
  else {
    runFloodFill();
  }

  trenchList.forEach((h) => {
    fill(0);
    rect(h.x, h.y, holeWidth, holeHeight);
  });
}

function getNeighbors(x, y) {
  const neighbors = [];

  let up = { x: x, y: y - holeHeight };
  let right = { x: x + holeWidth, y: y };
  let down = { x: x, y: y + holeHeight };
  let left = { x: x - holeWidth, y: y };

  if (!trenchMap[k(up)]) {
    neighbors.push(up);
  }
  if (!trenchMap[k(right)]) {
    neighbors.push(right);
  }
  if (!trenchMap[k(down)]) {
    neighbors.push(down);
  }
  if (!trenchMap[k(left)]) {
    neighbors.push(left);
  }

  return neighbors;
}

function runFloodFill() {

  if (floodInjectionPoint) {
    const neighborsUnflooded = getNeighbors(floodInjectionPoint.x, floodInjectionPoint.y);
    tilesToFlood = tilesToFlood.concat(neighborsUnflooded);
    const key = k({ x: floodInjectionPoint.x, y: floodInjectionPoint.y });
    trenchMap[key] = floodInjectionPoint;
    trenchList.push(trenchMap[key]);
    floodInjectionPoint = null;
  }

  for (let n = 0; n < speed; n++) {
    if (tilesToFlood.length > 0) {
      let neighborsMap = {}
      let nextNeigbors = [];
      tilesToFlood.forEach((t) => {
        const neighbors = getNeighbors(t.x, t.y);
        for (let i = 0; i < neighbors.length; i++) {
          const key = k(neighbors[i]);
          if (!neighborsMap[key]) {
            neighborsMap[key] = neighbors[i];
            nextNeigbors.push(neighbors[i]);
          }
        }
        const key = k({ x: t.x, y: t.y });
        if (!trenchMap[key]) {
          trenchMap[key] = t;
          trenchList.push(trenchMap[key]);
        }
      });

      tilesToFlood = nextNeigbors;
    }
    else {
      noLoop();
      console.log("Done!");
      console.log("Cubic meters digged out: ", trenchList.length);
      break;
    }
  }
}

function calculateBoundry() {
  for (let n = 0; n < speed; n++) {
    currentInstruction = instructions[i];
    const delta = getDelta(currentInstruction.direction);
    const color = currentInstruction.color;
    let tempX = diggerX;
    let tempY = diggerY;
    for (let n = 0; n < currentInstruction.count; n++) {
      const hole = { x: tempX, y: tempY, color: color };
      const key = k(hole)

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

    console.log("Processed instruction", i);

    if (i >= instructions.length) {
      noLoop();
      console.log("Done!");
      break;
    }
  }
}

