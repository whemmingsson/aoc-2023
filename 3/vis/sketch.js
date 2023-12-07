const matrix = [];

let cellSize = 7;
let cellWidth = 10;
let cellHeight = 6;
const setupMatrix = () => {
  for (let i = 0; i < data.length; i++) {
    let chars = data[i].split("");
    matrix[i] = chars;
  }
};

function setup() {
  createCanvas(cellWidth * 140, cellHeight * 140);
  noStroke();

  setupMatrix();
  console.log(data);
  console.log(matrix);
}

const symbolsColorsMap = {
  ".": { r: 0, g: 0, b: 0 },
  "*": { r: 255, g: 255, b: 255 },
};
const mapSymbolToColor = (symbol) => {
  if (parseInt(symbol) > 0) {
    return { r: 50, g: 100, b: 150 };
  }
  let color = symbolsColorsMap[symbol];
  if (color === undefined) {
    color = { r: random(50, 100), g: random(50, 100), b: random(50, 200) };
    symbolsColorsMap[symbol] = color;
  }
  return color;
};

const drawSymbol = (x, y, symbol) => {
  let color = mapSymbolToColor(symbol);
  fill(color.r, color.g, color.b);
  rect(x, y, cellWidth, cellHeight);
};

function draw() {
  background(220);

  // draw the matrix
  for (let i = 0; i < matrix.length; i++) {
    let chars = matrix[i];
    for (let j = 0; j < chars.length; j++) {
      let symbol = chars[j];
      drawSymbol(j * cellWidth, i * cellHeight, symbol);
    }
  }
  // draw a circle
  noLoop();
}
