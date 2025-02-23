'use client';

export interface PlayerImages {
  default: HTMLImageElement;
  up: HTMLImageElement[];
  down: HTMLImageElement[];
  right: HTMLImageElement[];
  left: HTMLImageElement[];
  upLeft: HTMLImageElement[];
  upRight: HTMLImageElement[];
  downLeft: HTMLImageElement[];
  downRight: HTMLImageElement[];
  kick: HTMLImageElement;
}

export interface BallImages {
  default: HTMLImageElement;
  moving: HTMLImageElement[];
}

export interface GameImages {
  brazil: PlayerImages;
  argentina: PlayerImages;
  ball: BallImages;
  background: HTMLImageElement;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error(`Failed to load image: ${src}`, e);
      reject(e);
    };
    img.src = src;
  });
}

export async function loadGameImages(): Promise<GameImages> {
  try {
    const brazilImages: PlayerImages = {
      default: await loadImage('/assets/images/BrazilSprites/running-left/1.png'),
      up: [
        await loadImage('/assets/images/BrazilSprites/running-up/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-up/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-up/3.png')
      ],
      down: [
        await loadImage('/assets/images/BrazilSprites/running-down/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-down/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-down/3.png')
      ],
      right: [
        await loadImage('/assets/images/BrazilSprites/running-left/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-left/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-left/3.png')
      ],
      left: [
        await loadImage('/assets/images/BrazilSprites/running-right/1 copy.png'),
        await loadImage('/assets/images/BrazilSprites/running-right/2 copy.png'),
        await loadImage('/assets/images/BrazilSprites/running-right/3 copy.png')
      ],
      upLeft: [
        await loadImage('/assets/images/BrazilSprites/running-upleft/1 copy.png'),
        await loadImage('/assets/images/BrazilSprites/running-upleft/2 copy.png'),
        await loadImage('/assets/images/BrazilSprites/running-upleft/3 copy.png')
      ],
      upRight: [
        await loadImage('/assets/images/BrazilSprites/running-upright/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-upright/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-upright/3.png')
      ],
      downLeft: [
        await loadImage('/assets/images/BrazilSprites/running-downleft/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-downleft/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-downleft/3.png')
      ],
      downRight: [
        await loadImage('/assets/images/BrazilSprites/running-downright/1.png'),
        await loadImage('/assets/images/BrazilSprites/running-downright/2.png'),
        await loadImage('/assets/images/BrazilSprites/running-downright/3.png')
      ],
      kick: await loadImage('/assets/images/BrazilSprites/kick/kick.png')
    };

    const argentinaImages: PlayerImages = {
      default: await loadImage('/assets/images/ArgentinaSprites/running-right/1.png'),
      up: [
        await loadImage('/assets/images/ArgentinaSprites/running-up/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-up/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-up/3.png')
      ],
      down: [
        await loadImage('/assets/images/ArgentinaSprites/running-down/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-down/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-down/3.png')
      ],
      right: [
        await loadImage('/assets/images/ArgentinaSprites/running-right/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-right/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-right/3.png')
      ],
      left: [
        await loadImage('/assets/images/ArgentinaSprites/running-left/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-left/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-left/3.png')
      ],
      upLeft: [
        await loadImage('/assets/images/ArgentinaSprites/running-upleft/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-upleft/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-upleft/3.png')
      ],
      upRight: [
        await loadImage('/assets/images/ArgentinaSprites/running-upright/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-upright/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-upright/3.png')
      ],
      downLeft: [
        await loadImage('/assets/images/ArgentinaSprites/running-downleft/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-downleft/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-downleft/3.png')
      ],
      downRight: [
        await loadImage('/assets/images/ArgentinaSprites/running-downright/1.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-downright/2.png'),
        await loadImage('/assets/images/ArgentinaSprites/running-downright/3.png')
      ],
      kick: await loadImage('/assets/images/ArgentinaSprites/kick/1.png')
    };

    const ballImages: BallImages = {
      default: await loadImage('/assets/images/Football/1.png'),
      moving: [
        await loadImage('/assets/images/Football/1.png'),
        await loadImage('/assets/images/Football/2.png'),
        await loadImage('/assets/images/Football/3.png'),
        await loadImage('/assets/images/Football/4.png')
      ]
    };

    const background = await loadImage('/assets/images/Map/international-superstar-soccer-europe-gba-map.webp');

    return {
      brazil: brazilImages,
      argentina: argentinaImages,
      ball: ballImages,
      background
    };
  } catch (error) {
    console.error('Failed to load game images:', error);
    throw error;
  }
} 