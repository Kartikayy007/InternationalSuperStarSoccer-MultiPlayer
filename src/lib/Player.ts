'use client';

import { InputHandler } from '@/types/game';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  frame: number;
  timer: number;
  interval: number;
  team: 'brazil' | 'argentina';
  controlling: boolean;
  current: string;
  possesball: boolean;
  kicking: boolean;
  kicktimer: number;
  movementangle: number;
  movementradius: number;
  movementspeed: number;
  visible: boolean;
  images: any;

  constructor(x: number, y: number, team: 'brazil' | 'argentina') {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 170;
    this.speed = 5;
    this.frame = 0;
    this.timer = 0;
    this.interval = 100;
    this.team = team;
    this.controlling = false;
    this.current = 'default';
    this.possesball = false;
    this.kicking = false;
    this.kicktimer = 0;
    this.movementangle = Math.random() * Math.PI;
    this.movementradius = 10;
    this.movementspeed = 0.05;
    this.visible = true;
  }

  update(input: InputHandler, ball: any) {
    if (this.controlling) {
      this.controllingPlayerUpdate(input);
    } else {
      this.nonControllingPlayerUpdate(ball);
    }

    this.animationFrame();

    if (this.kicking) {
      this.kickAnimation();
    }
  }

  kick() {
    if (this.possesball) {
      this.kicking = true;
      this.kicktimer = 0;
      return true;
    }
    return false;
  }

  controllingPlayerUpdate(input: InputHandler) {
    let x = 0;
    let y = 0;
    let speed = this.speed;

    if (input.keys.indexOf('w') !== -1) y -= speed;
    if (input.keys.indexOf('s') !== -1) y += speed;
    if (input.keys.indexOf('a') !== -1) x -= speed;
    if (input.keys.indexOf('d') !== -1) x += speed;

    if (x !== 0 && y !== 0) {
      x *= 0.7;
      y *= 0.7;
    }

    const leftBoundary = (this.y + y) * 0.5 - this.width * 10;
    const rightBoundary = (this.y + y) * 0.5 + window.innerWidth + this.width * 9;

    this.x = Math.max(leftBoundary, Math.min(this.x + x, rightBoundary));
    this.y = Math.max(-this.height * 2, Math.min(this.y + y, window.innerHeight + this.height * 1.5));

    if (x !== 0 || y !== 0) {
      this.updateDirection(x, y);
    } else {
      this.current = 'default';
      this.frame = 0;
    }
  }

  nonControllingPlayerUpdate(ball: any) {
    this.movementangle += this.movementspeed;
    const diagonalX = Math.cos(this.movementangle) * this.movementradius * 0.1;
    const diagonalY = Math.sin(this.movementangle) * this.movementradius * 0.1;
    this.x += diagonalX;
    this.y += diagonalY;

    this.faceBall(ball);
  }

  updateDirection(x: number, y: number) {
    if (y < 0 && x === 0) this.current = 'up';
    else if (y > 0 && x === 0) this.current = 'down';
    else if (x < 0 && y === 0) this.current = 'left';
    else if (x > 0 && y === 0) this.current = 'right';
    else if (y < 0 && x < 0) this.current = 'upLeft';
    else if (y < 0 && x > 0) this.current = 'upRight';
    else if (y > 0 && x < 0) this.current = 'downLeft';
    else if (y > 0 && x > 0) this.current = 'downRight';
  }

  faceBall(ball: any) {
    const x = ball.x - this.x;
    const y = ball.y - this.y;
    const angle = Math.atan2(y, x);

    if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
      this.current = 'right';
    } else if (angle > Math.PI / 4 && angle <= 3 * Math.PI / 4) {
      this.current = 'down';
    } else if (angle > 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) {
      this.current = 'left';
    } else {
      this.current = 'up';
    }
  }

  animationFrame() {
    this.timer += 16;
    if (this.timer >= this.interval) {
      this.timer = 0;
      this.frame = (this.frame + 1) % 3;
    }
  }

  kickAnimation() {
    this.kicktimer += 12;
    if (this.kicktimer >= 100) {
      this.kicking = false;
      this.kicktimer = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
    let currentImage;
    if (this.kicking) {
      currentImage = this.images.kick;
    } else {
      currentImage = this.current === 'default' ? this.images.default : this.images[this.current][this.frame];
    }
    ctx.drawImage(
      currentImage,
      this.x - this.width / 2 + offsetX,
      this.y - this.height / 2 + offsetY,
      this.width,
      this.height
    );

    if (this.controlling) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(this.x + offsetX, this.y + this.height / 2 + offsetY, this.width / 2, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
} 