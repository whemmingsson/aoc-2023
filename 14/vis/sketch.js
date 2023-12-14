
const rocks = [];
const cellSize = 10;
let y = -1;
let x = 0;
let speed = 1;
const directions = ["u", "l", "d", "r"];

const deltaMap = {
    u: { x: 0, y: -1 },
    l: { x: -1, y: 0 },
    d: { x: 0, y: 1 },
    r: { x: 1, y: 0 }
};

let options = null;

let direction = directions[0];
let directionsIndex = 0;
let iter = 0;

function swap(a, b) {
    a.rock = ".";
    b.rock = "O";
    let c = a.color;
    a.color = b.color;
    b.color = c;
}

function shiftUp() {

    for (let x = 0; x < rocks[y].length; x++) {
        let rock = rocks[y][x];
        let other = rocks[y - 1][x];
        if (rock.rock === "O" && other.rock === ".") {
            swap(rock, other);
        } else if (rock.rock === "O" && other.rock === "O") {
            let i = y;
            while (i >= 1 && rocks[i][x].rock !== "." && rocks[i][x].rock !== "#") {
                i--;
            }
            if (rocks[i][x].rock === ".") {
                swap(rock, rocks[i][x]);
            }
        }
    }
}

function shiftLeft() {
    for (let y = 0; y < rocks.length; y++) {
        // for (let x = map[y].length - 1; x > 0; x--) {
        let rock = rocks[y][x];
        let other = rocks[y][x - 1];
        if (rock.rock === "O" && other.rock === ".") {
            swap(rock, other);
        } else if (rock.rock === "O" && other.rock === "O") {
            let i = x;
            while (i >= 1 && rocks[y][i].rock !== "." && rocks[y][i].rock !== "#") {
                i--;
            }
            if (rocks[y][i].rock === ".") {
                swap(rock, rocks[y][i]);
            }
        }
    }
    //}
}

function shiftDown() {
    //for (let y = 0; y < map.length - 1; y++) {
    for (let x = 0; x < rocks[y].length; x++) {
        let rock = rocks[y][x];
        let other = rocks[y + 1][x];
        if (rock.rock === "O" && other.rock === ".") {
            swap(rock, other);
        } else if (rock.rock === "O" && other.rock === "O") {
            let i = y;
            while (i < rocks.length - 1 && rocks[i][x].rock !== "." && rocks[i][x].rock !== "#") {
                i++;
            }
            if (rocks[i][x].rock === ".") {
                swap(rock, rocks[i][x]);
            }
        }
    }
    //}
}

function shiftRight() {
    for (let y = 0; y < rocks.length; y++) {
        //for (let x = 0; x < map[y].length - 1; x++) {
        let rock = rocks[y][x];
        let other = rocks[y][x + 1];
        if (rock.rock === "O" && other.rock === ".") {
            swap(rock, other);
        } else if (rock.rock === "O" && other.rock === "O") {
            let i = x;
            while (i <= rocks.length - 1 && rocks[y][i].rock !== "." && rocks[y][i].rock !== "#") {
                i++;
            }
            if (rocks[y][i] && rocks[y][i].rock === ".") {
                swap(rock, rocks[y][i]);
            }
        }
        //}
    }
}

class hsbColor {
    constructor(h, s, b) {
        this.h = h;
        this.s = s;
        this.b = b;
    }
}

function setup() {
    const canvas = createCanvas(cellSize * 100, cellSize * 100);
    canvas.parent("sketch");
    ellipseMode(CORNER);
    colorMode(HSB, 360);
    const rows = data.split("\n");

    function getColor(tile, r) {
        if (tile === "#") {
            return new hsbColor(0, 0, 100);
        } else if (tile === "O") {
            return new hsbColor(map(r, 0, 100, 0, 360), 200, 320);
        } else {
            return new hsbColor(0, 0, 0);
        }
    }

    for (let y = 0; y < rows.length; y++) {
        const row = rows[y];
        rocks[y] = [];
        for (let x = 0; x < row.length; x++) {
            rocks[y].push({ rock: rows[y][x], x: x, y: y, color: getColor(rows[y][x], x) });
        }
    }

    y = rocks.length - 1;
    x = rocks[0].length - 1;

    options = {
        u: { x: 0, y: rocks.length - 1, d: { x: 0, y: -1 }, shift: shiftUp },
        l: { x: rocks[0].length - 1, y: 0, d: { x: -1, y: 0 }, shift: shiftLeft },
        d: { x: 0, y: 0, d: { x: 0, y: 1 }, shift: shiftDown },
        r: {
            x: 0, y: 0, d: { x: 1, y: 0 }, shift: shiftRight
        }

    }
}

function drawMap() {
    background(0);
    for (let y = 0; y < rocks.length; y++) {
        for (let x = 0; x < rocks[y].length; x++) {
            let c = rocks[y][x].color;
            fill(c.h, c.s, c.b);
            if (rocks[y][x].rock === "O") {
                //fill(255);
                ellipse(x * cellSize, y * cellSize, cellSize, cellSize);
            } else if (rocks[y][x].rock === "#") {
                //fill(10);
                rect(x * cellSize, y * cellSize, cellSize, cellSize);
            } else {
                fill(0);
                rect(x * cellSize, y * cellSize, cellSize, cellSize);
            }

        }
    }

}


function draw() {

    // Shift up
    for (let i = 0; i < speed; i++) {
        options[direction].shift();
        y += options[direction].d.y;
        x += options[direction].d.x;

        iter++;

        if (iter % (100 - 1) === 0) {
            //noLoop();
            nextDirection();
        }

    }

    drawMap();
    //}
}
function nextDirection() {
    directionsIndex++;
    directionsIndex = directionsIndex % directions.length;
    direction = directions[directionsIndex];
    x = options[direction].x;
    y = options[direction].y;
    speed++;

}

