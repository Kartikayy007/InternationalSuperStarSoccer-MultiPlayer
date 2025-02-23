'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@/lib/Player';
import { Ball } from '@/lib/Ball';
import { InputHandler } from '@/types/game';
import { loadGameImages, GameImages } from '@/lib/loadImages';
import { AudioManager } from '@/lib/audio';

interface GameState {
  input: InputHandler;
  brazil: Player[];
  argentina: Player[];
  oncontrol: Player | null;
  defensiveRadius: number;
  argentinaPossessionTimer: number;
  argentinaPassInterval: number;
  score: { brazil: number; argentina: number };
  showingScoreScreen: boolean;
  scoreScreenTimer: number;
  goalWidth: number;
  goalHeight: number;
  brazilGoalX: number;
  argentinaGoalX: number;
  goalY: number;
  penaltyAreaWidth: number;
  penaltyAreaHeight: number;
  brazilPenaltyAreaX: number;
  argentinaPenaltyAreaX: number;
  gameTime: number;
  gameDuration: number;
  gameOver: boolean;
  lastScoringTeam?: string;
  images?: GameImages;
}

interface PlayerPosition {
  x: number;
  y: number;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const ballRef = useRef<Ball | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const backgroundRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const audioRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize audio
    audioRef.current = new AudioManager();

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize game state
    const input = new InputHandler();
    const ball = new Ball(canvas.width / 1.18, canvas.height / 2.2);
    ballRef.current = ball;

    gameRef.current= {
      input,
      brazil: [],
      argentina: [],
      oncontrol: null,  
      defensiveRadius: 1000,
      argentinaPossessionTimer: 0,
      argentinaPassInterval: Math.random() * 500 + 1500,
      score: { brazil: 0, argentina: 0 },
      showingScoreScreen: false,
      scoreScreenTimer: 0,
      goalWidth: 10,
      goalHeight: 450,
      brazilGoalX: -1000,
      argentinaGoalX: canvas.width + 1200,
      goalY: (canvas.height - 450) / 2 - 100,
      penaltyAreaWidth: 900,
      penaltyAreaHeight: 600,
      brazilPenaltyAreaX: -900 - 200,
      argentinaPenaltyAreaX: canvas.width - 900 + 2000,
      gameTime: 0,
      gameDuration: 10 * 60 * 1000,
      gameOver: false
    };

    const brazilPositions: PlayerPosition[] = [
      { x: canvas.width * -0.2, y: canvas.height * 0.5 },
      { x: canvas.width * -0.1, y: canvas.height * 0.01 },
      { x: canvas.width * 0, y: canvas.height * 0.5 },
      { x: canvas.width * 0.1, y: canvas.height * 1 },
      { x: canvas.width * 0, y: canvas.height * -0.2 },
      { x: canvas.width * 0.2, y: canvas.height * 0.4 },
      { x: canvas.width * 0.4, y: canvas.height * 1 },
      { x: canvas.width * 0.3, y: canvas.height * -0.2 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5 },
      { x: canvas.width * 0.65, y: canvas.height * 1 }
    ];

    const argentinaPositions: PlayerPosition[] = [
      { x: canvas.width * 1.2, y: canvas.height * 0.5 },
      { x: canvas.width * 1.1, y: canvas.height * 0.01 },
      { x: canvas.width * 1, y: canvas.height * 0.5 },
      { x: canvas.width * 0.9, y: canvas.height * 1 },
      { x: canvas.width * 1, y: canvas.height * -0.2 },
      { x: canvas.width * 0.9, y: canvas.height * 0.4 },
      { x: canvas.width * 1, y: canvas.height * 1.2 },
      { x: canvas.width * 0.7, y: canvas.height * -0.2 },
      { x: canvas.width * 0.7, y: canvas.height * 0.5 },
      { x: canvas.width * 0.9, y: canvas.height * 1 }
    ];

    // Load images and initialize game
    loadGameImages().then(images => {
      if (!gameRef.current || !canvas || !ctx) return;

      gameRef.current.images = images;
      backgroundRef.current = {
        width: images.background.naturalWidth,
        height: images.background.naturalHeight
      };

      // Create players with images
      brazilPositions.forEach(pos => {
        const player = new Player(pos.x, pos.y, 'brazil');
        player.images = images.brazil;
        gameRef.current!.brazil.push(player);
      });

      argentinaPositions.forEach(pos => {
        const player = new Player(pos.x, pos.y, 'argentina');
        player.images = images.argentina;
        gameRef.current!.argentina.push(player);
      });

      // Set ball images
      if (ballRef.current) {
        ballRef.current.image = images.ball;
      }

      // Set initial control
      gameRef.current.oncontrol = gameRef.current.brazil[8];
      gameRef.current.oncontrol.controlling = true;

      // Start game loop
      gameLoop();

      // Start music on first interaction
      const startMusic = () => {
        if (audioRef.current) {
          audioRef.current.startMusic();
          window.removeEventListener('click', startMusic);
          window.removeEventListener('keydown', startMusic);
        }
      };

      window.addEventListener('click', startMusic);
      window.addEventListener('keydown', startMusic);
    });

    function drawGame() {
      if (!gameRef.current || !gameRef.current.images || !ballRef.current || !ctx || !canvas) return;
      const game = gameRef.current;
      const ball = ballRef.current;
      const images = game.images as GameImages;

      // Draw background with zoom
      const zoom = 2.5;
      const diagonalX = canvas.width / 2 - ball.x;
      const diagonalY = canvas.height / 2 - ball.y;

      ctx.drawImage(
        images.background,
        diagonalX - (backgroundRef.current.width * (zoom - 1)) / 2,
        diagonalY - (backgroundRef.current.height * (zoom - 1)) / 2,
        backgroundRef.current.width * zoom,
        backgroundRef.current.height * zoom
      );

      if (game.showingScoreScreen) {
        drawScoreScreen();
        hideBallandPlayers();
      } else {
        showBallandPlayers();
        game.brazil.forEach(player => {
          if (player.visible) player.draw(ctx, diagonalX, diagonalY);
        });
        game.argentina.forEach(player => {
          if (player.visible) player.draw(ctx, diagonalX, diagonalY);
        });
        ball.draw(ctx, diagonalX, diagonalY);
      }

      drawTimerAndScoreboard();
    }

    function drawScoreScreen() {
      if (!gameRef.current || !ctx || !canvas) return;
      const game = gameRef.current;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px Sixtyfour Convergence';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(`${game.lastScoringTeam?.toUpperCase()} SCORES!`, canvas.width / 2, canvas.height / 2 - 50);
      ctx.fillText(`Brazil ${game.score.brazil} - ${game.score.argentina} Argentina`, canvas.width / 2, canvas.height / 2 + 50);
    }

    function drawTimerAndScoreboard() {
      if (!gameRef.current || !ctx || !canvas) return;
      const game = gameRef.current;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, 70);

      ctx.fillStyle = 'white';
      ctx.font = '24px Sixtyfour Convergence';
      ctx.textAlign = 'center';

      const remainingTime = Math.max(0, game.gameDuration - game.gameTime);
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      const timerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      ctx.fillText(timerText, canvas.width / 2, 30);

      const scoreText = `Brazil ${game.score.brazil} - ${game.score.argentina} Argentina`;
      ctx.fillText(scoreText, canvas.width / 2, 60);
    }

    function hideBallandPlayers() {
      if (!gameRef.current || !ballRef.current) return;
      const game = gameRef.current;
      const ball = ballRef.current;

      game.brazil.forEach(player => {
        player.possesball = false;
        player.visible = false;
      });
      game.argentina.forEach(player => {
        player.possesball = false;
        player.visible = false;
      });
      ball.possession = '';
    }

    function showBallandPlayers() {
      if (!gameRef.current) return;
      const game = gameRef.current;

      game.brazil.forEach(player => player.visible = true);
      game.argentina.forEach(player => player.visible = true);
    }

    const gameLoop = () => {
      if (!gameRef.current || !ballRef.current) return;
      const game = gameRef.current;
      const ball = ballRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!game.gameOver) {
        // Update game state
        if (game.input.lastkey === 'Space') {
          // Handle pass
          game.input.lastkey = '';
        }

        // Update players
        game.brazil.forEach(player => player.update(game.input, ball));
        game.argentina.forEach(player => player.update(game.input, ball));

        // Update game time
        game.gameTime += 16;
        if (game.gameTime >= game.gameDuration) {
          game.gameOver = true;
        }

        // Update ball
        ball.update([...game.brazil, ...game.argentina]);

        // Draw game
        drawGame();
      } else {
        drawGameOverScreen();
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    function drawGameOverScreen() {
      if (!gameRef.current || !ctx || !canvas) return;
      const game = gameRef.current;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = '48px Sixtyfour Convergence';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100);

      ctx.font = '36px Sixtyfour Convergence';
      ctx.fillText(`Final Score: Brazil ${game.score.brazil} - ${game.score.argentina} Argentina`, canvas.width / 2, canvas.height / 2);

      ctx.fillStyle = 'black';
      ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 100, 200, 50);
      ctx.fillStyle = 'white';
      ctx.font = '36px Sixtyfour Convergence';
      ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 130);
      canvas.style.cursor = 'pointer';
    }

    // Handle restart click
    function handleRestartClick(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100 &&
          y >= canvas.height / 2 + 100 && y <= canvas.height / 2 + 150) {
        window.location.reload();
      }
    }

    canvas.addEventListener('click', handleRestartClick);

    return () => {
      canvas.removeEventListener('click', handleRestartClick);
      if (audioRef.current) {
        audioRef.current.stopMusic();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
} 