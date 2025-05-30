const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
let gameOver = false;

class Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    framesMax = 1,
    animations = {},
  }) {
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.position = position;
    this.velocity = velocity;
    this.width = this.image.width * this.scale;
    this.height = this.image.height * this.scale;
    this.framesMax = framesMax;
    this.offset = offset;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.animations = animations;
    this.dead = false;
    for (const key in animations) {
      const img = new Image();
      img.src = animations[key].imageSrc;
      animations[key].image = img;
    }

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
  }

  draw() {
    if (this.image.complete) {
      const frameWidth = this.image.width / this.framesMax;
      const frameHeight = this.image.height;
      c.drawImage(
        this.image,
        this.framesCurrent * frameWidth,
        0,
        frameWidth,
        frameHeight,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        frameWidth * this.scale,
        frameHeight * this.scale
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

  animate() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  changeSprite(animationKey) {
    const animation = this.animations[animationKey];

    if (this.dead && animationKey !== "Death") return;

    if (
      animation &&
      this.image !== animation.image &&
      (!this.isAttacking ||
        animationKey.includes("attack") ||
        animationKey === "takeHit" ||
        animationKey === "death")
    ) {
      this.image = animation.image;
      this.framesMax = animation.framesMax;
      this.framesCurrent = 0;
    }
  }

  update() {
    this.draw();
    this.animate();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

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
    }, this.framesMax * this.framesHold * (1000 / 60));
  }

  isOnGround() {
    return this.position.y + this.height >= canvas.height;
  }
}
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

const background = new Background({
  position: { x: 0, y: 0 },
  imageSrc: "./somethingElseSprites/Background.png",
});

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imageSrc: "./somethingElseSprites/Player1/Idle.png",
  framesMax: 8,
  scale: 1.5,
  animations: {
    idle: {
      imageSrc: "./somethingElseSprites/Player1/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./somethingElseSprites/Player1/Run.png",
      framesMax: 8,
    },
    jump: { imageSrc: "./somethingElseSprites/Player1/Jump.png", framesMax: 2 },
    fall: { imageSrc: "./somethingElseSprites/Player1/Fall.png", framesMax: 2 },
    attack1: {
      imageSrc: "./somethingElseSprites/Player1/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./somethingElseSprites/Player1/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./somethingElseSprites/Player1/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./somethingElseSprites/Player1/Death.png",
      framesMax: 6,
    },
  },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  color: "blue",
  imageSrc: "./somethingElseSprites/Player2/Idle.png",
  framesMax: 4,
  scale: 1.5,
  animations: {
    idle: { imageSrc: "./somethingElseSprites/Player2/Idle.png", framesMax: 4 },
    run: { imageSrc: "./somethingElseSprites/Player2/Run.png", framesMax: 8 },
    jump: { imageSrc: "./somethingElseSprites/Player2/Jump.png", framesMax: 2 },
    fall: { imageSrc: "./somethingElseSprites/Player2/Fall.png", framesMax: 2 },
    attack1: {
      imageSrc: "./somethingElseSprites/Player2/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./somethingElseSprites/Player2/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./somethingElseSprites/Player2/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./somethingElseSprites/Player2/Death.png",
      framesMax: 7,
    },
  },
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  space: { pressed: false },

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

  //player 1 move left and right
  if (!gameOver && !player.dead) {
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
  if (!gameOver && !enemy.dead) {
    if (Math.abs(distanceX) > 100) {
      enemy.changeSprite("run");
      enemy.velocity.x = distanceX > 0 ? 2 : -2;
    } else {
      enemy.velocity.x = 0;
      enemy.changeSprite("idle");
    }
    if (
      Math.abs(distanceX) < 120 &&
      Math.random() < 0.02 &&
      !enemy.isAttacking
    ) {
      enemy.changeSprite("attack1");
      enemy.attack();
    }
  }

  //check for attack hits
  if (
    rectangularCollision({ attacker: player, defender: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.changeSprite("takeHit");
    console.log("hit");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ attacker: enemy, defender: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.changeSprite("takeHit");
    console.log("enemyhit");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.health <= 0) {
    enemy.changeSprite("Death");
    determineWinner({ player, enemy, timerID });
  }
  if (player.health <= 0) {
    player.changeSprite("Death");
    determineWinner({ player, enemy, timerID });
  }

  //change some sprites for player
  // if (!gameOver) {
  //   if (player.velocity.y < 0) {
  //     player.changeSprite("jump");
  //   } else if (keys.a.pressed || keys.d.pressed) {
  //     player.changeSprite("run");
  //   } else {
  //     player.changeSprite("idle");
  //   }
  // }

  if (!gameOver && !player.isAttacking) {
    if (player.velocity.y < 0) {
      player.changeSprite("jump");
    } else if (!player.isOnGround()) {
      player.changeSprite("fall");
    } else if (keys.a.pressed || keys.d.pressed) {
      player.changeSprite("run");
    } else {
      player.changeSprite("idle");
    }
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
        player.changeSprite("run");
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        player.changeSprite("run");
        break;
      case "w":
        if (player.isOnGround()) player.velocity.y = -20;
        player.changeSprite("jump");
        break;

      case " ":
        player.attack();
        player.changeSprite("attack1");
        break;

      // case "ArrowRight":
      //   keys.ArrowRight.pressed = true;
      //   enemy.lastKey = "ArrowRight";
      //   break;
      // case "ArrowLeft":
      //   keys.ArrowLeft.pressed = true;
      //   enemy.lastKey = "ArrowLeft";
      //   break;
      // case "ArrowUp":
      //   if (enemy.isOnGround()) enemy.velocity.y = -20;
      //   break;
      // case "ArrowDown":
      //   enemy.attack();
      //   break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // case "ArrowRight":
    //   keys.ArrowRight.pressed = false;
    //   break;
    // case "ArrowLeft":
    //   keys.ArrowLeft.pressed = false;
    //   break;

    case "d":
      keys.d.pressed = false;
      player.changeSprite("idle");
      break;
    case "a":
      keys.a.pressed = false;
      player.changeSprite("idle");
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
