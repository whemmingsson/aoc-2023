let grid = [];
const cellSize = 15;
const pipeWidth = cellSize / 3;
let start = {};
let current;
let steps = 0;
function setup() {
  data.split("\n").forEach((row, i) => {
    const cols = row.split("");
    grid[i] = [];
    cols.forEach((c, j) => {
      grid[i][j] = { value: c, x: j, y: i, visited: false };
      if (c === "S") {
        console.log("Found start, save it");
        start = grid[i][j];
        grid[i][j].visited = true;
        start.value = "|";
        console.log(start);
      }
    });
  });
  current = start;
  console.log(current);
  console.log("Begin rendering..");
  pixelDensity(1);
  ellipseMode(CORNER);
  createCanvas(cellSize * grid[0].length, cellSize * grid.length);

  //console.log(grid);
}

const getAdjacent = (x, y) => {
  let result = [];
  if (grid[y - 1] && grid[y - 1][x]) {
    grid[y - 1][x].direction = "U";
    result.push(grid[y - 1][x]);
  } // Top
  if (grid[y][x + 1]) {
    grid[y][x + 1].direction = "R";
    result.push(grid[y][x + 1]);
  } // Right
  if (grid[y + 1] && grid[y + 1][x]) {
    grid[y + 1][x].direction = "D";
    result.push(grid[y + 1][x]);
  } // Down
  if (grid[y][x - 1]) {
    grid[y][x - 1].direction = "L";
    result.push(grid[y][x - 1]);
  } // Left

  return result;
};

const filterWalkable = (current, list) => {
  console.log(current);
  if (current === "|") {
    return list.filter((n) => (n.direction === "U" && (n.value === "|" || n.value === "F" || n.value === "7")) || (n.direction === "D" && (n.value === "|" || n.value === "J" || n.value === "L")));
  } else if (current === "-") {
    return list.filter((n) => (n.direction === "L" && (n.value === "-" || n.value === "L" || n.value === "F")) || (n.direction === "R" && (n.value === "-" || n.value === "7" || n.value === "J")));
  } else if (current === "J") {
    return list.filter((n) => (n.direction === "U" && (n.value === "|" || n.value === "7" || n.value === "F")) || (n.direction === "L" && (n.value === "-" || n.value === "L" || n.value === "F")));
  } else if (current === "L") {
    return list.filter((n) => (n.direction === "U" && (n.value === "|" || n.value === "F" || n.value === "7")) || (n.direction === "R" && (n.value === "-" || n.value === "7" || n.value === "J")));
  } else if (current === "F") {
    return list.filter((n) => (n.direction === "D" && (n.value === "|" || n.value === "J" || n.value === "L")) || (n.direction === "R" && (n.value === "-" || n.value === "7" || n.value === "J")));
  } else if (current === "7") {
    return list.filter((n) => (n.direction === "L" && (n.value === "-" || n.value === "L" || n.value === "F")) || (n.direction === "D" && (n.value === "|" || n.value === "J" || n.value === "L")));
  }
};

const drawCell = (x, y, v, finalRender) => {
  if (finalRender) {
    /*console.log("Final render...");
    noStroke();
    if (v.visited) {
      fill(0, 0, 255);
      rect(x * cellSize + pipeWidth, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
    } else {
      fill(0);
      rect(x * cellSize + pipeWidth, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
    }

    return; */
  }
  //rect(x * cellSize, y * cellSize, cellSize, cellSize);
  noStroke();
  fill(150);
  if (v.visited) {
    fill(0, 255, 0);
  } else {
    fill(255);
  }
  switch (v.value) {
    case "|":
      rect(x * cellSize + pipeWidth, y * cellSize, pipeWidth, cellSize);
      break;
    case "-":
      rect(x * cellSize, y * cellSize + pipeWidth, cellSize, pipeWidth);
      break;
    case "L":
      rect(x * cellSize + pipeWidth, y * cellSize, pipeWidth, pipeWidth * 2);
      rect(x * cellSize + pipeWidth * 2, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
      break;
    case "J":
      rect(x * cellSize + pipeWidth, y * cellSize, pipeWidth, pipeWidth * 2);
      rect(x * cellSize, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
      break;
    case "7":
      rect(x * cellSize + pipeWidth, y * cellSize + pipeWidth, pipeWidth, pipeWidth * 2);
      rect(x * cellSize, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
      break;
    case "F":
      rect(x * cellSize + pipeWidth, y * cellSize + pipeWidth, pipeWidth, pipeWidth * 2);
      rect(x * cellSize + pipeWidth * 2, y * cellSize + pipeWidth, pipeWidth, pipeWidth);
      break;
    case "S":
      fill(255, 0, 0);
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    case ".":
      //stroke(125);
      fill(255, 0, 0);
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    //fill(50);
    //ellipse(x * cellSize, y * cellSize, cellSize, cellSize);
  }
  //rect(x * cellSize, y * cellSize, cellSize, cellSize);
};

function draw() {
  for (let j = 0; j < 1000; j++) {
    current.visited = true;
    current.on = true;

    const adjacent = getAdjacent(current.x, current.y);
    const walkableAdjecent = filterWalkable(current.value, adjacent);

    const notVisited = [];
    for (let i = 0; i < walkableAdjecent.length; i++) {
      let ajd = walkableAdjecent[i];
      if (ajd.visited === false) {
        notVisited.push(ajd);
      }
    }

    let possibleNext = notVisited[0];

    if (possibleNext) {
      current.on = false;
      current = possibleNext;
    } else {
      background(0);
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          drawCell(x, y, grid[y][x], true);
        }
      }
      noLoop();
      return;
    }

    steps++;
    console.log(steps);
  }

  background(0);
  noStroke();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      drawCell(x, y, grid[y][x]);
    }
  }
}
