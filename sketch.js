let leftPaddle;
let rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;
let hitSound;
let scoreSound;

function preload() {
  hitSound = loadSound("hit.mp3");
  scoreSound = loadSound("score.mp3");
}

function setup() {
  createCanvas(600, 400);

  leftPaddle = new Paddle(true);
  rightPaddle = new Paddle(false);
  ball = new Ball();
}

function draw() {
  background(0);

  // Exibe o placar
  textSize(32);
  fill(255);
  text(leftScore, width / 4, 50);
  text(rightScore, (3 * width) / 4, 50);

  leftPaddle.show();
  rightPaddle.show();
  ball.show();

  leftPaddle.update();
  rightPaddle.update();
  ball.update();

  checkCollisions();
}

function checkCollisions() {
  // Verifica colisões com as raquetes
  if (ball.hitsPaddle(leftPaddle) || ball.hitsPaddle(rightPaddle)) {
    ball.reflect();
    ball.increaseSpeed();
    hitSound.play();
  }

  // Verifica colisões com as bordas superior e inferior
  if (ball.hitsTop() || ball.hitsBottom()) {
    ball.reverseY();
  }

  // Verifica se a bola ultrapassou as raquetes (ponto marcado)
  if (ball.isOutOfBounds()) {
    if (ball.x < width / 2) {
      rightScore++;
    } else {
      leftScore++;
    }
    ball.reset();
    scoreSound.play();
  }
}

function keyPressed() {
  // Controla a raquete esquerda com as teclas W e S
  if (key === "w") {
    leftPaddle.move(-1);
  } else if (key === "s") {
    leftPaddle.move(1);
  }

  // Controla a raquete direita com as teclas de seta para cima e para baixo
  if (keyCode === UP_ARROW) {
    rightPaddle.move(-1);
  } else if (keyCode === DOWN_ARROW) {
    rightPaddle.move(1);
  }
}

function keyReleased() {
  // Para a raquete esquerda quando as teclas W ou S são liberadas
  if (key === "w" || key === "s") {
    leftPaddle.move(0);
  }

  // Para a raquete direita quando as teclas de seta para cima ou para baixo são liberadas
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    rightPaddle.move(0);
  }
}

class Paddle {
  constructor(isLeft) {
    this.w = 10;
    this.h = 80;
    this.y = height / 2 - this.h / 2;
    this.isLeft = isLeft;
    this.ySpeed = 0;
    this.speed = 5;
  }

  show() {
    fill(255);
    noStroke();
    rect(this.isLeft ? 0 : width - this.w, this.y, this.w, this.h);
  }

  update() {
    this.y += this.ySpeed;
    this.y = constrain(this.y, 0, height - this.h);
  }

  move(direction) {
    this.ySpeed = this.speed * direction;
  }
}

class Ball {
  constructor() {
    this.size = 15;
    this.reset();
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(3, 5) * (random() > 0.5 ? 1 : -1);
    this.ySpeed = random(2, 4) * (random() > 0.5 ? 1 : -1);
  }

  hitsTop() {
    return this.y - this.size / 2 < 0;
  }

  hitsBottom() {
    return this.y + this.size / 2 > height;
  }

  hitsPaddle(paddle) {
    if (
      this.x - this.size / 2 < (paddle.isLeft ? paddle.w : width - paddle.w) &&
      this.x + this.size / 2 > (paddle.isLeft ? 0 : width - paddle.w) &&
      this.y > paddle.y &&
      this.y < paddle.y + paddle.h
    ) {
      return true;
    }
    return false;
  }

  isOutOfBounds() {
    return this.x - this.size / 2 < 0 || this.x + this.size / 2 > width;
  }

  reflect() {
    this.xSpeed *= -1;
  }

  reverseY() {
    this.ySpeed *= -1;
  }

  increaseSpeed() {
    // Aumenta a velocidade da bola ao refletir nas raquetes
    this.xSpeed *= 1.05;
    this.ySpeed *= 1.05;
  }
}
