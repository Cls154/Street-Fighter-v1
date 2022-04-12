class Sprite {
  constructor({ position, imageSrc, scale = 1, maxFrames = 1, offset = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrames = 0;
    this.elapsedFrames = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,

      this.currentFrames * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,

      this.position.x - this.offset.x, 
      this.position.y - this.offset.y, 
      this.image.width / this.maxFrames * this.scale, 
      this.image.height * this.scale,
    );
  }

  animateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.framesHold === 0) {
      if (this.currentFrames < this.maxFrames - 1) {
        this.currentFrames++
      } else {
        this.currentFrames = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({ position, velocity, color, imageSrc, scale = 1, maxFrames = 1, offset, sprites, attackBox = { offset: {}, width: undefined, height: undefined, }}) {
    super({ imageSrc, scale, maxFrames, position, offset, })
    this.velocity = velocity;
    this.color = color;

    this.width = 50;
    this.height = 150;
    this.lastKey;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    }
    this.isAttacking;
    this.healthBar = 100;
    this.dead = false;

    this.currentFrames = 0;
    this.elapsedFrames = 0;
    this.framesHold = 5;

    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if(!this.dead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96.5) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  takeHit() {
    this.healthBar -= 20;
    if (this.healthBar <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrames === this.sprites.death.maxFrames - 1) {
        this.dead = true;
      }
      return;
    }
    if (this.image === this.sprites.attack1.image && this.currentFrames < this.sprites.attack1.maxFrames - 1) {
      return;
    }
    if (this.image === this.sprites.takeHit.image && this.currentFrames < this.sprites.takeHit.maxFrames - 1) {
      return;
    }

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.maxFrames = this.sprites.attack1.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.maxFrames = this.sprites.takeHit.maxFrames;
          this.currentFrames = 0;
        }
        break;
      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.maxFrames = this.sprites.death.maxFrames;
          this.currentFrames = 0;
        }
        break;
    }
  }
}