const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/redwoods.png",
});

//----------------------------------------------------------------------
//PLAYER 1 -------------------------------------------------------------
//----------------------------------------------------------------------
const player = new Fighter({
  position: {
    x: 25,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Martial_Hero/Sprites/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 213,
    y: 145,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Martial_Hero/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/Martial_Hero/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/Martial_Hero/Sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/Martial_Hero/Sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/Martial_Hero/Sprites/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/Martial_Hero/Sprites/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/Martial_Hero/Sprites/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 117,
      y: 50,
    },
    width: 138,
    height: 45,
  },
});

//----------------------------------------------------------------------
//ENEMY 1 -------------------------------------------------------------
//----------------------------------------------------------------------
const enemy = new Fighter({
  position: {
    x: 947, //947
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/Kenji/Sprites/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 213,
    y: 145,
  },
  sprites: {
    idle: {
      imageSrc: "./img/Kenji/Sprites/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/Kenji/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/Kenji/Sprites/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/Kenji/Sprites/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/Kenji/Sprites/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/Kenji/Sprites/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/Kenji/Sprites/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -117,
      y: 72,
    },
    width: 124,
    height: 45,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

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

  //Player Movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //PLAYER JUMP ANIMATION
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //ENEMY JUMP ANIMATION
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //Collision & enemy hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent == 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent == 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent == 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent == 2) {
    enemy.isAttacking = false;
  }

  //END GAME ON HEALTH
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    //PLAYER ACTIONS
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -15;
        break;
      case "s":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    //ENEMY ACTIONS
    switch (e.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -15;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  //Player
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //Enemy
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
