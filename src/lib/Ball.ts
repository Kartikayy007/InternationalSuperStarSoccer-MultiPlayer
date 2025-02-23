'use client';

import { Player } from './Player';

export class Ball {
  x: number;
  y: number;
  radius: number;
  image: {
    default: HTMLImageElement;
    moving: HTMLImageElement[];
  };
  possession: Player | '';
  frame: number;
  timer: number;
  interval: number;
  passing: boolean;
  passtarget: Player | null;
  passSpeed: number;
  lasttouch: Player | null;
  kickSpeed: number;
  kickangle: number | '';
  visible: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.image = {
      default: new Image(),
      moving: [new Image(), new Image(), new Image(), new Image()]
    };
    this.possession = '';
    this.frame = 0;
    this.timer = 0;
    this.interval = 20;
    this.passing = false;
    this.passtarget = null;
    this.passSpeed = 25;
    this.lasttouch = null;
    this.kickSpeed = 35;
    this.kickangle = '';
    this.visible = true;
  }

  draw(ctx: CanvasRenderingContext2D, diagonalX: number, offsetY: number) {
    let currentImage;
    if (this.possession || this.passing) {
      currentImage = this.image.moving[this.frame];
    } else {
      currentImage = this.image.default;
    }
    ctx.drawImage(
      currentImage,
      this.x - this.radius + diagonalX,
      this.y - this.radius + offsetY,
      this.radius * 3.5,
      this.radius * 3.5
    );
  }

  update(players: Player[]) {
    if (this.kickangle !== '') {
      this.updateKickPosition();
    } else if (this.passing) {
      this.updatePassingPosition();
    } else if (this.possession) {
      this.updatePositionWithPossession();
      this.checkPlayerCollisions(players);
    } else {
      this.ballcollision(players);
    }
    this.ballAnimation();
  }

  kick(angle: number) {
    this.kickangle = angle;
    this.passing = false;
    this.possession = '';
    this.interval = 5;
  }

  updateKickPosition() {
    if (typeof this.kickangle === 'number') {
      this.x += Math.cos(this.kickangle) * this.kickSpeed;
      this.y += Math.sin(this.kickangle) * this.kickSpeed;
    }
  }

  updatePositionWithPossession() {
    if (!this.possession || typeof this.possession === 'string') return;

    const diagonalX = 30;
    const diagonalY = 50;

    switch (this.possession.current) {
      case 'left':
        this.x = this.possession.x - diagonalX;
        this.y = this.possession.y + diagonalY;
        break;
      case 'right':
        this.x = this.possession.x + diagonalX;
        this.y = this.possession.y + diagonalY;
        break;
      case 'up':
        this.x = this.possession.x;
        this.y = this.possession.y + diagonalY;
        break;
      case 'down':
        this.x = this.possession.x;
        this.y = this.possession.y + diagonalY + 20;
        break;
      default:
        this.x = this.possession.x;
        this.y = this.possession.y + diagonalY;
        break;
    }
  }

  checkPlayerCollisions(players: Player[]) {
    if (!this.possession || typeof this.possession === 'string') return;

    players.forEach(player => {
      if (player !== this.possession && this.playercolliding(player, this.possession as Player)) {
        if (player.team !== (this.possession as Player).team) {
          this.changePossession(player);
        }
      }
    });
  }

  ballcollision(players: Player[]) {
    players.forEach(player => {
      if (this.playercollidingWithBall(player)) {
        this.changePossession(player);
      }
    });
  }

  playercolliding(player1: Player, player2: Player) {
    const x = player1.x - player2.x;
    const y = player1.y - player2.y;
    const distance = Math.sqrt(x * x + y * y);
    return distance < player1.width / 2 + player2.width / 2;
  }

  playercollidingWithBall(player: Player) {
    const x = player.x - this.x;
    const y = player.y - this.y;
    const distance = Math.sqrt(x * x + y * y);
    return distance < player.width / 2 + this.radius;
  }

  changePossession(player: Player) {
    if (this.possession && typeof this.possession !== 'string') {
      this.possession.possesball = false;
    }
    this.possession = player;
    player.possesball = true;
    this.lasttouch = player;
  }

  ballAnimation() {
    this.timer += 16;
    if (this.timer >= this.interval) {
      this.timer = 0;
      if (this.possession && typeof this.possession !== 'string' && this.possession.current === 'right') {
        this.frame = (this.frame - 1 + 4) % 4;
      } else {
        this.frame = (this.frame + 1) % 4;
      }
    }
  }

  pass(target: Player) {
    this.passing = true;
    this.passtarget = target;
    this.possession = '';
    this.interval = 10;
  }

  updatePassingPosition() {
    if (!this.passtarget) return;

    const x = this.passtarget.x - this.x;
    const y = this.passtarget.y - this.y;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > this.passSpeed) {
      this.x += (x / distance) * this.passSpeed;
      this.y += (y / distance) * this.passSpeed;
    } else {
      this.x = this.passtarget.x;
      this.y = this.passtarget.y;
      this.passing = false;
      this.passtarget.possesball = true;
      this.possession = this.passtarget;
      this.interval = 20;
    }
    this.ballAnimation();
  }
} 