// --- Variáveis Globais do Jogo ---
let boat;
let trash = [];
let score = 0;
let gameOver 

// --- Variáveis para o Fundo Animado (Ondas do Mar) ---
let startAngle = 0;
let amplitude = 25; // Ondas ligeiramente maiores
let frequency = 0.03; // Ondas mais frequente
let waveSpeed = 1; // Ondas mais rápidas
let baseHue = 200; // Tom de base para as cores da água

// --- Configurações e Parâmetros do Jogo ---
const NUM_TRASH = 15; // Mais lixo para coletar
const BOAT_SIZE = 40;
const TRASH_SIZE = 15;
const SPAWN_AREA_MARGIN = 50;

function setup() {
  createCanvas(800, 500);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100); // Usar HSB para cores mais vibrantes

  boat = {
    x: width / 2,
    y: height - 50,
    size: BOAT_SIZE,
    color: color(30, 80, 80) // Cor mais vibrante para o barco
  };

  for (let i = 0; i < NUM_TRASH; i++) {
    spawnTrash();
  }
}

function draw() {
  drawBackground();

  if (!gameOver) {
    updateBoat();
    drawBoat();
    updateAndDrawTrash();
    checkCollisions();
    displayScore();
  } else {
    displayGameOver();
  }
}

// --- Funções de Desenho ---

function drawBackground() {
  // Céu com gradiente
  let skyColor1 = color(200, 100, 100);
  let skyColor2 = color(220, 100, 100);
  for (let i = 0; i <= height / 2; i++) {
    let inter = map(i, 0, height / 2, 0, 1);
    let c = lerpColor(skyColor1, skyColor2, inter);
    stroke(c);
    line(0, i, width, i);
  }
  noStroke();

  // Ondas animadas e coloridas
  for (let yOffset = 0; yOffset < 3; yOffset++) {
    fill(baseHue + yOffset * 20, 100, 80, 150 - yOffset * 50); // Cores da água mais vibrantes
    beginShape();
    vertex(0, height);
    for (let x = 0; x <= width; x += 10) {
      let y = map(sin(startAngle + x * frequency + yOffset * 50), -1, 1,
        height * 0.4, height * 0.6);
      vertex(x, y);
    }
    vertex(width, height);
    endShape(CLOSE);
  }

  startAngle += waveSpeed;
}

function drawBoat() {
  fill(boat.color);
  noStroke();
  rect(boat.x - boat.size / 2, boat.y - boat.size / 4, boat.size, boat.size / 2);
  triangle(boat.x - boat.size / 2, boat.y - boat.size / 4,
    boat.x + boat.size / 2, boat.y - boat.size / 4,
    boat.x, boat.y - boat.size * 0.75);
}

function drawTrash(t) {
  fill(t.color); // Lixo com cores aleatórias
  noStroke();
  ellipse(t.x, t.y, t.size, t.size);
}

function displayScore() {
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Lixo Coletado: ${score}/${NUM_TRASH}`, 10, 10);
}

function displayGameOver() {
  fill(0, 100);
  rect(0, 0, width, height);

  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Parabéns!", width / 2, height / 2 - 30);
  textSize(24);
  text("Você limpou o mar!", width / 2, height / 2 + 20);
  textSize(18);
  text("Pressione 'R' para jogar novamente", width / 2, height / 2 + 60);
}

// --- Funções de Lógica ---

function updateBoat() {
  boat.x = mouseX;
  boat.x = constrain(boat.x, boat.size / 2, width - boat.size / 2);
}

function updateAndDrawTrash() {
  for (let i = trash.length - 1; i >= 0; i--) {
    let t = trash[i];
    t.y += t.speed;
    t.x += sin(frameCount * t.wobbleSpeed) * t.wobbleAmount;

    drawTrash(t);

    if (t.y > height + t.size / 2) {
      trash.splice(i, 1);
      spawnTrash();
    }
  }
}

function spawnTrash() {
  // Cores aleatórias para o lixo
  let trashColor = color(random(360), 100, 100);
  let newTrash = {
    x: random(SPAWN_AREA_MARGIN, width - SPAWN_AREA_MARGIN),
    y: random(-height / 2, -TRASH_SIZE),
    size: TRASH_SIZE,
    speed: random(0.5, 2),
    wobbleSpeed: random(2, 5),
    wobbleAmount: random(0.5, 2),
    color: "black" // Adiciona a cor ao lixo
  };
  trash.push(newTrash);
}

function checkCollisions() {
  for (let i = trash.length - 1; i >= 0; i--) {
    let t = trash[i];
    let d = dist(boat.x, boat.y, t.x, t.y);
    if (d < (boat.size / 2 + t.size / 2)) {
      trash.splice(i, 1);
      score++;
      if (score >= NUM_TRASH) {
        gameOver = true;
      } else {
        spawnTrash();
      }
    }
  }
}

// --- Funções de Eventos ---

function keyPressed() {
  if (keyCode === 82& gameOver) {
    resetGame();
  }
}

function resetGame() {
  score = 0;
  trash = [];
  for (let i = 0; i < NUM_TRASH; i++) {
    spawnTrash();
  }
  gameOver = false;
  startAngle = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  boat.x = width / 2;
  boat.y = height - 50;
}