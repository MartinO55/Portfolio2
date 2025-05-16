const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
let gameOver = false;

class Background {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.width = 50;
    this.height = 150;

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      canvas.width,
      canvas.height
    );
  }

  update() {
    this.draw();
  }
}

class Sprite {
  constructor({ position, velocity, color = "red", offset, imageSrc }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    if (this.image.complete) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  isOnGround() {
    return this.position.y + this.height >= canvas.height;
  }
}

const background = new Background({
  position: { x: 0, y: 0 },
  imageSrc: "./somethingElseSprites/Background.png",
});

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imageSrc: "./somethingElseSprites/Player1/Idle.png",
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  color: "blue",
  imageSrc: "./somethingElseSprites/Player2/Idle.png",
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },

  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
};

function rectangularCollision({ attacker, defender }) {
  //1 is attacker, 2 is defender
  return (
    attacker.attackBox.position.x + attacker.attackBox.width >=
      defender.position.x &&
    attacker.attackBox.position.x <= defender.position.x + defender.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      defender.position.y &&
    attacker.attackBox.position.y <= defender.position.y + defender.height
  );
}

function determineWinner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  gameOver = true;
  const restartButton = document.querySelector("#restartButton");

  document.querySelector("#UIScriptOverlay").style.display = "flex";
  restartButton.style.display = "inline-block";
  if (player.health === enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Player One Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Player Two Wins";
  }
}

let timer = 100;
let timerID;
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer__clock").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerID });
  }
}

decreaseTimer();
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player 1 move
  if (!gameOver) {
    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 5;
    }
  }

  //note to self - add a switch here to allow for 2 player control
  // player2 move
  // if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
  //   enemy.velocity.x = -5;
  // } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
  //   enemy.velocity.x = 5;
  // }

  //AI Movement
  let distanceX = player.position.x - enemy.position.x;
  if (!gameOver) {
    if (Math.abs(distanceX) > 100) {
      enemy.velocity.x = distanceX > 0 ? 2 : -2;
    } else {
      enemy.velocity.x = 0;
    }
    if (
      Math.abs(distanceX) < 120 &&
      Math.random() < 0.02 &&
      !enemy.isAttacking
    ) {
      enemy.attack();
    }
  }

  //check for attack hits
  if (
    rectangularCollision({ attacker: player, defender: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("hit");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ attacker: enemy, defender: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("player2hit");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  //console.log(event.key);
  if (!gameOver) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.isOnGround()) player.velocity.y = -20;
        break;

      case " ":
        player.attack();
        break;

      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.isOnGround()) enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});

document.querySelector("#restartButton").addEventListener("click", () => {
  player.health = 100;
  enemy.health = 100;
  document.querySelector("#playerHealth").style.width = "100%";
  document.querySelector("#enemyHealth").style.width = "100%";

  player.position.x = 0;
  player.position.y = 0;
  player.velocity = { x: 0, y: 0 };

  enemy.position.x = 400;
  enemy.position.y = 100;
  enemy.velocity = { x: 0, y: 0 };

  document.querySelector("#UIScriptOverlay").style.display = "none";

  timer = 100;
  gameOver = false;
  decreaseTimer();
});
