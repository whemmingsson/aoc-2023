class hsbColor {
  constructor(h, s, b) {
    this.h = h;
    this.s = s;
    this.b = b;
  }
}

class MyColor {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static random() {
    return new MyColor(random(100, 255), random(100, 255), random(100, 255));
  }
}

const matrix = [];
const cellSize = 12;
let energized = {};
let beams = [];

const countEnergized = () => {
  return Object.keys(energized).length;
};

const direction = (beam) => {
  if (beam.dy === 1 && beam.dx === 0) return "D";
  if (beam.dy === -1 && beam.dx === 0) return "U";
  if (beam.dx === 1 && beam.dy === 0) return "R";
  if (beam.dx === -1 && beam.dy === 0) return "L";

  throw Error("YOU'RE A STUPID");
};

function setup() {
  const canvas = createCanvas(2000, 2000);
  canvas.parent("sketch");
  ellipseMode(CORNER);

  const rows = data.split("\n");

  rows.forEach((r, i) => {
    matrix[i] = [];
    r.split("").forEach((e, j) => {
      matrix[i].push({ x: j, y: i, energized: false, value: e });
    });
  });

  console.log(matrix.length, matrix[0].length);

  const lightBeam = {
    x: -1,
    y: 0,
    dy: 0,
    dx: 1,
    color: MyColor.random(),
  };

  beams.push(lightBeam);

  drawMap();
}

const runBeams = () => {
  let newBeam = null;
  let newBeams = [];
  let toRemoveBeams = [];
  for (let i = 0; i < beams.length; i++) {
    let beam = beams[i];

    // Move to next tile
    beam.x += beam.dx;
    beam.y += beam.dy;

    if (beam.x >= 0 && beam.x < matrix[0].length && beam.y >= 0 && beam.y < matrix.length) {
      const k = beam.x + "_" + beam.y;
      energized[k] = { x: beam.x, y: beam.y };
    } else {
      //console.log("Beam is dead (outside of space)", beam.x, beam.y, "Max values:", matrix.length, matrix[0].length);
      toRemoveBeams.push(beam);
      continue;
    }

    let tile = matrix[beam.y][beam.x].value;

    const d = direction(beam);

    switch (tile) {
      case "0":
        // NAZING
        break;
      case "7":
        if (d === "U") {
          beam.dx = 1;
          beam.dy = 0;
        }
        if (d === "L") {
          beam.dx = 0;
          beam.dy = 1;
        }
        if (d === "R") {
          beam.dx = 0;
          beam.dy = -1;
        }
        if (d === "D") {
          beam.dx = -1;
          beam.dy = 0;
        }
        break;

      case "3": // \
        if (d === "U") {
          beam.dx = -1;
          beam.dy = 0;
        }
        if (d === "L") {
          beam.dx = 0;
          beam.dy = -1;
        }
        if (d === "R") {
          beam.dx = 0;
          beam.dy = 1;
        }
        if (d === "D") {
          beam.dx = 1;
          beam.dy = 0;
        }
        break;

      case "2":
        if (d === "L" || d === "R") {
          // NAZING
        } else if (d === "D" || d === "U") {
          // Current beam go left:
          beam.dy = 0;
          beam.dx = -1;

          // New beam go right
          newBeam = {
            x: beam.x,
            y: beam.y,
            dy: 0,
            dx: 1,
            color: MyColor.random(),
          };
          newBeams.push(newBeam);
        }
        break;
      case "1":
        if (d === "D" || d === "U") {
          // NAZING
        } else if (d === "R" || d === "L") {
          // Current beam go up:
          beam.dx = 0;
          beam.dy = -1;

          // New beam go down
          newBeam = {
            x: beam.x,
            y: beam.y,
            dy: 1,
            dx: 0,
            color: MyColor.random(),
          };
          newBeams.push(newBeam);
        }
    }
  }
  if (newBeams.length > 0) {
    beams.push(...newBeams);
  }
  if (toRemoveBeams.length > 0) {
    for (let j = 0; j < toRemoveBeams.length; j++) {
      let b = toRemoveBeams[j];
      const idx = beams.indexOf(b);
      beams.splice(idx, 1);
    }
  }
};


function mousePressed() {
  speed = 1;
}

function drawMap() {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      let cell = matrix[y][x];
      switch (cell.value) {
        case "0": fill(0); break;
        case "1":
          stroke(255);
          strokeWeight(2);
          line(x * cellSize + cellSize / 2, y * cellSize, x * cellSize + cellSize / 2, y * cellSize + cellSize);
          break;
        case "2":
          stroke(255);
          strokeWeight(2);
          line(x * cellSize, y * cellSize + cellSize / 2, x * cellSize + cellSize, y * cellSize + cellSize / 2);
          break;
        case "7":
          stroke(255);
          strokeWeight(2);
          line(x * cellSize + cellSize, y * cellSize, x * cellSize, y * cellSize + cellSize);
          break;
        case "3":
          stroke(255);
          strokeWeight(2);
          line(x * cellSize, y * cellSize, x * cellSize + cellSize, y * cellSize + cellSize);
          break;
      }
      //rect(x * 12, y * 12, 12, 12);
    }
  }
}

function draw() {
  for (let i = 0; i < 79; i++) {
    runBeams();

    // Remove beams that are outside of the map
    beams = beams.filter(b => {
      return b.x >= 0 && b.x < matrix[0].length && b.y >= 0 && b.y < matrix.length;
    });

    if (beams.length > 150) {
      beams = beams.slice(0, 150);
    }
  }


  beams.forEach(b => {
    fill(b.color.r, b.color.g, b.color.b);
    noStroke();
    rect(b.x * cellSize, b.y * cellSize, cellSize, cellSize);
  });



}

function mousePressed() {
  console.log(countEnergized());
}
