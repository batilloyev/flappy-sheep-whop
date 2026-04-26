const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const scoreNode = document.querySelector("#score");
const bestScoreNode = document.querySelector("#best-score");
const coinsNode = document.querySelector("#coins");
const overlay = document.querySelector("#overlay");
const statusNode = document.querySelector("#status");
const overlayTitle = document.querySelector("#overlay-title");
const overlayCopy = document.querySelector("#overlay-copy");
const startButton = document.querySelector("#start-button");

const STORAGE_KEY = "flappy-sheep-best";
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GRAVITY = 0.34;
const FLAP_FORCE = -7.4;
const SHEEP_SIZE = 34;
const PIPE_WIDTH = 70;
const PIPE_SPACING = 170;

let bestScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
let gameState = "ready";
let frame = 0;
let score = 0;
let coins = 0;
let speed = 2.75;
let gap = 172;
let sheep;
let pipes;
let clovers;
let particles;
let animationFrameId;

bestScoreNode.textContent = bestScore;

function resetGame() {
  frame = 0;
  score = 0;
  coins = 0;
  speed = 2.75;
  gap = 172;
  sheep = {
    x: 110,
    y: HEIGHT * 0.42,
    velocity: 0,
    rotation: 0,
  };
  pipes = [];
  clovers = [];
  particles = [];
  updateHud();
}

function updateHud() {
  scoreNode.textContent = score;
  bestScoreNode.textContent = bestScore;
  coinsNode.textContent = coins;
}

function showOverlay(status, title, copy, buttonText) {
  statusNode.textContent = status;
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  startButton.textContent = buttonText;
  overlay.hidden = false;
}

function hideOverlay() {
  overlay.hidden = true;
}

function startGame() {
  resetGame();
  gameState = "playing";
  hideOverlay();
  flap();
}

function endGame() {
  gameState = "over";

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem(STORAGE_KEY, String(bestScore));
  }

  burst(sheep.x, sheep.y, "#ffffff", 18);
  updateHud();
  showOverlay(
    score > 0 ? "Game over" : "Ouch",
    `Score ${score}`,
    `You collected ${coins} golden clover${coins === 1 ? "" : "s"}. Tap restart and beat your best score.`,
    "Restart"
  );
}

function flap() {
  if (gameState === "ready" || gameState === "over") {
    startGame();
    return;
  }

  sheep.velocity = FLAP_FORCE;
  sheep.rotation = -0.35;
  burst(sheep.x - 12, sheep.y + 12, "#dff7ff", 5);
}

function spawnPipe() {
  const safeTop = 80;
  const safeBottom = HEIGHT - 120;
  const center = safeTop + Math.random() * (safeBottom - safeTop - gap) + gap / 2;
  const topHeight = center - gap / 2;
  const bottomY = center + gap / 2;
  const pipe = {
    x: WIDTH + PIPE_WIDTH,
    topHeight,
    bottomY,
    scored: false,
  };

  pipes.push(pipe);
  clovers.push({
    x: pipe.x + PIPE_WIDTH / 2,
    y: center,
    radius: 11,
    collected: false,
  });
}

function updateDifficulty() {
  const level = Math.floor(score / 5);
  speed = 2.75 + level * 0.28;
  gap = Math.max(128, 172 - level * 6);
}

function updateGame() {
  frame += 1;

  if (gameState === "playing") {
    sheep.velocity += GRAVITY;
    sheep.y += sheep.velocity;
    sheep.rotation = Math.min(0.7, sheep.rotation + 0.035);

    if (frame % PIPE_SPACING === 1) {
      spawnPipe();
    }

    for (const pipe of pipes) {
      pipe.x -= speed;

      if (!pipe.scored && pipe.x + PIPE_WIDTH < sheep.x) {
        pipe.scored = true;
        score += 1;
        updateDifficulty();
        updateHud();
      }
    }

    for (const clover of clovers) {
      clover.x -= speed;
      const touching =
        !clover.collected &&
        distance(sheep.x, sheep.y, clover.x, clover.y) < SHEEP_SIZE / 2 + clover.radius;

      if (touching) {
        clover.collected = true;
        coins += 1;
        burst(clover.x, clover.y, "#ffd166", 12);
        updateHud();
      }
    }

    pipes = pipes.filter((pipe) => pipe.x > -PIPE_WIDTH);
    clovers = clovers.filter((clover) => clover.x > -30 && !clover.collected);

    if (sheep.y < SHEEP_SIZE / 2 || sheep.y > HEIGHT - 44 || hitsPipe()) {
      endGame();
    }
  } else if (gameState === "ready") {
    sheep.y = HEIGHT * 0.42 + Math.sin(frame / 18) * 10;
    sheep.rotation = Math.sin(frame / 22) * 0.08;
  }

  updateParticles();
}

function hitsPipe() {
  const sheepLeft = sheep.x - SHEEP_SIZE / 2;
  const sheepRight = sheep.x + SHEEP_SIZE / 2;
  const sheepTop = sheep.y - SHEEP_SIZE / 2;
  const sheepBottom = sheep.y + SHEEP_SIZE / 2;

  return pipes.some((pipe) => {
    const withinX = sheepRight > pipe.x && sheepLeft < pipe.x + PIPE_WIDTH;
    const hitsTop = sheepTop < pipe.topHeight;
    const hitsBottom = sheepBottom > pipe.bottomY;
    return withinX && (hitsTop || hitsBottom);
  });
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function burst(x, y, color, amount) {
  for (let index = 0; index < amount; index += 1) {
    particles.push({
      x,
      y,
      color,
      radius: 2 + Math.random() * 3,
      velocityX: -1.5 + Math.random() * 3,
      velocityY: -2.5 + Math.random() * 5,
      life: 28 + Math.random() * 18,
    });
  }
}

function updateParticles() {
  for (const particle of particles) {
    particle.x += particle.velocityX;
    particle.y += particle.velocityY;
    particle.velocityY += 0.08;
    particle.life -= 1;
  }

  particles = particles.filter((particle) => particle.life > 0);
}

function drawGame() {
  drawSky();
  drawClouds();
  drawPipes();
  drawClovers();
  drawGround();
  drawSheep();
  drawParticles();
}

function drawSky() {
  const gradient = context.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#6fd2ff");
  gradient.addColorStop(0.62, "#b4ecff");
  gradient.addColorStop(1, "#dff6d8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawClouds() {
  context.fillStyle = "rgba(255, 255, 255, 0.78)";

  for (let index = 0; index < 5; index += 1) {
    const x = ((index * 120 - frame * 0.35) % (WIDTH + 180)) - 80;
    const y = 80 + Math.sin(index) * 38;
    blob(x, y, 24, 18);
    blob(x + 24, y - 8, 32, 24);
    blob(x + 54, y, 26, 18);
  }
}

function drawPipes() {
  for (const pipe of pipes) {
    drawPipe(pipe.x, 0, PIPE_WIDTH, pipe.topHeight, true);
    drawPipe(pipe.x, pipe.bottomY, PIPE_WIDTH, HEIGHT - pipe.bottomY - 40, false);
  }
}

function drawPipe(x, y, width, height, flip) {
  context.fillStyle = "#22995a";
  context.fillRect(x, y, width, height);
  context.fillStyle = "#42dc85";
  context.fillRect(x + 8, y, 12, height);
  context.fillStyle = "#176c42";
  context.fillRect(x + width - 14, y, 14, height);

  const lipY = flip ? y + height - 18 : y;
  context.fillStyle = "#1b7d4c";
  context.fillRect(x - 6, lipY, width + 12, 18);
}

function drawClovers() {
  for (const clover of clovers) {
    context.save();
    context.translate(clover.x, clover.y);
    context.rotate(frame / 18);
    context.fillStyle = "#ffd166";
    blob(-6, -6, 7, 7);
    blob(6, -6, 7, 7);
    blob(-6, 6, 7, 7);
    blob(6, 6, 7, 7);
    context.restore();
  }
}

function drawGround() {
  context.fillStyle = "#7ccd73";
  context.fillRect(0, HEIGHT - 40, WIDTH, 40);
  context.fillStyle = "rgba(255,255,255,0.25)";

  for (let x = (-frame * speed) % 42; x < WIDTH; x += 42) {
    context.fillRect(x, HEIGHT - 34, 22, 5);
  }
}

function drawSheep() {
  context.save();
  context.translate(sheep.x, sheep.y);
  context.rotate(sheep.rotation);

  context.fillStyle = "#141414";
  blob(-13, 16, 5, 10);
  blob(13, 16, 5, 10);

  context.fillStyle = "#f7f7f2";
  blob(0, 0, 22, 18);
  blob(-15, -6, 13, 13);
  blob(-4, -14, 14, 12);
  blob(13, -8, 12, 12);

  context.fillStyle = "#232323";
  blob(20, -1, 12, 11);
  context.fillStyle = "#ffffff";
  blob(23, -4, 3.5, 3.5);
  context.fillStyle = "#121212";
  blob(24, -4, 1.5, 1.5);

  context.restore();
}

function drawParticles() {
  for (const particle of particles) {
    context.globalAlpha = Math.max(0, particle.life / 44);
    context.fillStyle = particle.color;
    blob(particle.x, particle.y, particle.radius, particle.radius);
  }

  context.globalAlpha = 1;
}

function blob(x, y, radiusX, radiusY) {
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.fill();
}

function loop() {
  updateGame();
  drawGame();
  animationFrameId = requestAnimationFrame(loop);
}

function handleInput(event) {
  if (event.type === "keydown" && event.code !== "Space") {
    return;
  }

  event.preventDefault();
  flap();
}

startButton.addEventListener("click", startGame);
canvas.addEventListener("pointerdown", handleInput);
window.addEventListener("keydown", handleInput);

resetGame();
showOverlay("Ready?", "Tap to fly", "Press Space, click, or tap. Dodge pipes and collect clovers.", "Start game");
cancelAnimationFrame(animationFrameId);
loop();
