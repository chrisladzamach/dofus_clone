const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileWidth = 64;
const tileHeight = 32;

let cols, rows;

let playerCol = 1;
let playerRow = 1;
let targetCol = playerCol;
let targetRow = playerRow;
let pathQueue = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.ceil(canvas.width / tileWidth) * 2;
  rows = Math.ceil(canvas.height / tileHeight) * 2;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function gridToScreen(col, row) {
  return {
    x: (col - row) * (tileWidth / 2) + canvas.width / 2,
    y: (col + row) * (tileHeight / 2)
  };
}

function screenToGrid(x, y) {
  x -= canvas.width / 2;
  const col = Math.floor((x / (tileWidth / 2) + y / (tileHeight / 2)) / 2);
  const row = Math.floor((y / (tileHeight / 2) - x / (tileWidth / 2)) / 2);
  return { col, row };
}

function moveTo(col, row) {
  if (col < 0 || row < 0 || col >= cols || row >= rows) return;
  const pos = gridToScreen(col, row);
  playerCol = col;
  playerRow = row;
}

function drawTile(col, row) {
  const { x, y } = gridToScreen(col, row);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
  ctx.lineTo(x, y + tileHeight);
  ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2);
  ctx.closePath();
  ctx.strokeStyle = "#333";
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fill();
}

function drawGrid() {
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      drawTile(c, r);
    }
  }
}

function drawPlayer() {
  const { x, y } = gridToScreen(playerCol, playerRow);
  ctx.fillStyle = "red";
  ctx.fillRect(x - 0, y - 0, 20, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPlayer();
}

function update() {
  if (pathQueue.length > 0) {
    const nextStep = pathQueue.shift();
    moveTo(nextStep.col, nextStep.row);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const { col, row } = screenToGrid(mx, my);

  if (col < 0 || row < 0 || col >= cols || row >= rows) return;

  targetCol = col;
  targetRow = row;

  pathQueue = [];
  let c = playerCol;
  let r = playerRow;

  while (c !== targetCol || r !== targetRow) {
    if (r !== targetRow) {
      r += r < targetRow ? 1 : -1;
      pathQueue.push({ col: c, row: r });
    }
    if (c !== targetCol) {
      c += c < targetCol ? 1 : -1;
      pathQueue.push({ col: c, row: r });
    }
  }
});