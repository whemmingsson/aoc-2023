const Parser = require("../common/parser.js");

module.exports = class Day {
  static run() {
    let matrix = [];
    const rows = Parser.readRaw(__dirname, true).split("\n");
    console.log(rows);

    rows.forEach((r, i) => {
      matrix[i] = [];
      r.split("")
        .map((v) => parseInt(v))
        .forEach((v) => {
          matrix[i].push(v);
        });
    });

    const printMatrix = () => {
      matrix.forEach((r) => {
        console.log(r.join(""));
      });
    };

    console.log(matrix);
    printMatrix();

    const pointer = { x: 0, y: 0, dir: null };
  }

  /*  1  function Dijkstra(Graph, source):
 2      
 3      for each vertex v in Graph.Vertices:
 4          dist[v] ← INFINITY
 5          prev[v] ← UNDEFINED
 6          add v to Q
 7      dist[source] ← 0
 8      
 9      while Q is not empty:
10          u ← vertex in Q with min dist[u]
11          remove u from Q
12          
13          for each neighbor v of u still in Q:
14              alt ← dist[u] + Graph.Edges(u, v)
15              if alt < dist[v]:
16                  dist[v] ← alt
17                  prev[v] ← u
18
19      return dist[], prev[] */
};

function Dijkstra(matrix, source) {
  const dist = [];
  const prev = [];
  const Q = [];

  const findMin = 

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const key = x + "_" + y;
      dist[key] = Infinity;
      prev[key] = undefined;
      Q.push(key);
    }
  }
  dist["0_0"] = 0;

  while(Q.length > 0){

  }
}
