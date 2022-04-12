const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: { x: 0, y: 0, },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: { x: 625, y: 128, },
  imageSrc: './img/shop.png',
  scale: 2.75,
  maxFrames: 6,
});

const player = new Fighter({
  position: { x: 0, y: 0, },
  velocity: { x: 0, y: 0, },
  color: 'blue',
  offset: { x: 0, y: 0, },
  imageSrc: './img/samuraiMack/Idle.png',
  scale: 2.5,
  maxFrames: 8,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      maxFrames: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      maxFrames: 8,
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      maxFrames: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      maxFrames: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      maxFrames: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      maxFrames: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      maxFrames: 6,
    }
  },
  attackBox: {
    offset: {
      x: 100, y: 50,
    },
    width: 150,
    height: 50,
  }
})

const enemy = new Fighter({
  position: { x: 400, y: 100, },
  velocity: { x: 0, y: 0, },
  color: 'red',
  offset: { x: -50, y: 0, },
  imageSrc: './img/kenji/Idle.png',
  scale: 2.5,
  maxFrames: 4,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      maxFrames: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      maxFrames: 8,
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      maxFrames: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      maxFrames: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      maxFrames: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      maxFrames: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      maxFrames: 7,
    }
    
  },
  attackBox: {
    offset: {
      x: -170, y: 50,
    },
    width: 170,
    height: 50,
  }
})

const keys = {
  d: { pressed: false, },
  a: { pressed: false, },
  ArrowRight: { pressed: false, },
  ArrowLeft: { pressed: false, },
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  if (rectangularCollision({ attacker: player, target: enemy}) && player.isAttacking && player.currentFrames === 4) {
    enemy.takeHit();
    player.isAttacking = false;
    // document.querySelector('#enemyHealth').style.width = enemy.healthBar + '%';
    gsap.to('#enemyHealth', {
      width: enemy.healthBar + '%'
    })
  }
  if (rectangularCollision({ attacker: enemy, target: player }) && enemy.isAttacking && enemy.currentFrames === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    // document.querySelector('#playerHealth').style.width = player.healthBar + '%';
    gsap.to('#playerHealth', {
      width: player.healthBar + '%'
    })
  }

  if (player.isAttacking && player.currentFrames === 4) {
    player.isAttacking = false;
  }
  if (enemy.isAttacking && enemy.currentFrames === 2) {
    enemy.isAttacking = false;
  }

  //end game based on health
  if (enemy.healthBar <= 0 || player.healthBar <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

window.addEventListener('keydown', (event) => {
  //player movement
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        player.lastKey = 'd';
        keys.d.pressed = true;
        break;
      case 'a':
        player.lastKey = 'a';
        keys.a.pressed = true;
        break;
      case 'w':
        player.velocity.y = -20;
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  //enemy movement
  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        enemy.lastKey = 'ArrowRight';
        keys.ArrowRight.pressed = true;
        break;
      case 'ArrowLeft':
        enemy.lastKey = 'ArrowLeft';
        keys.ArrowLeft.pressed = true;
        break;
      case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
})

window.addEventListener('keyup', (event) => {
  //player movement
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
  //enemy movement
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
})

window.addEventListener('load', animate);