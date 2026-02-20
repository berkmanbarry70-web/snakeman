import readline from "readline";

/* ===== NEON COLORS ===== */
const reset = "\x1b[0m";
const green = t => `\x1b[92m${t}${reset}`;
const red = t => `\x1b[91m${t}${reset}`;
const cyan = t => `\x1b[96m${t}${reset}`;
const yellow = t => `\x1b[93m${t}${reset}`;
const blue = t => `\x1b[94m${t}${reset}`;
const white = t => `\x1b[97m${t}${reset}`;

const width = 20;
const height = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = spawnFood();
let score = 0;
let speed = 150;
let gameInterval;

/* ===== RAW INPUT (WASD REAL-TIME) ===== */

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, key) => {
  if (key.name === "w" && direction.y === 0) direction = { x: 0, y: -1 };
  if (key.name === "s" && direction.y === 0) direction = { x: 0, y: 1 };
  if (key.name === "a" && direction.x === 0) direction = { x: -1, y: 0 };
  if (key.name === "d" && direction.x === 0) direction = { x: 1, y: 0 };
  if (key.ctrl && key.name === "c") process.exit();
});

/* ===== SOUND ===== */

function eatSound() {
  process.stdout.write("\x07"); // terminal beep
}

function gameOverSound() {
  process.stdout.write("\x07\x07\x07");
}

/* ===== SPAWN FOOD ===== */

function spawnFood() {
  return {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height)
  };
}

/* ===== DRAW ===== */

function draw() {
  console.clear();

  console.log(blue("████████████████████████████"));
  console.log(cyan("         SNAKEMAN"));
  console.log(blue("████████████████████████████"));
  console.log("");

  console.log(yellow("Score:"), green(score));
  console.log("");

  // Top wall
  console.log(white("+" + "-".repeat(width) + "+"));

  for (let y = 0; y < height; y++) {
    let row = "|";

    for (let x = 0; x < width; x++) {
      if (snake.some(s => s.x === x && s.y === y)) {
        row += green("█");
      } else if (food.x === x && food.y === y) {
        row += red("●");
      } else {
        row += " ";
      }
    }

    row += "|";
    console.log(white(row));
  }

  // Bottom wall
  console.log(white("+" + "-".repeat(width) + "+"));
}

/* ===== GAME LOGIC ===== */

function update() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // wall collision
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    return gameOver();
  }

  // self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound();
    food = spawnFood();

    if (speed > 60) speed -= 5;
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
  } else {
    snake.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverSound();
  console.clear();
  console.log(red("████████████████████████████"));
  console.log(red("        GAME OVER"));
  console.log(red("████████████████████████████"));
  console.log("");
  console.log(yellow("Final Score:"), green(score));
  process.exit();
}

/* ===== START ===== */

draw();
gameInterval = setInterval(update, speed);
