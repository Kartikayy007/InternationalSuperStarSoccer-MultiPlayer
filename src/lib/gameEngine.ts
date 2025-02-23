import type { Player, Ball, GameSettings } from '@/types/game';

export function updateBallPhysics(ball: Ball, settings: GameSettings) {
  // Update ball position based on velocity
  ball.position.x += ball.velocity.x * settings.ballSpeed;
  ball.position.y += ball.velocity.y * settings.ballSpeed;

  // Apply friction
  ball.velocity.x *= 0.98;
  ball.velocity.y *= 0.98;

  // Boundary checks
  if (ball.position.x <= 0 || ball.position.x >= settings.fieldDimensions.width) {
    ball.velocity.x *= -0.8;
    ball.position.x = Math.max(0, Math.min(ball.position.x, settings.fieldDimensions.width));
  }

  if (ball.position.y <= 0 || ball.position.y >= settings.fieldDimensions.height) {
    ball.velocity.y *= -0.8;
    ball.position.y = Math.max(0, Math.min(ball.position.y, settings.fieldDimensions.height));
  }
}

export function updatePlayerPhysics(player: Player, settings: GameSettings) {
  // Update player position based on velocity
  player.position.x += player.velocity.x * settings.playerSpeed;
  player.position.y += player.velocity.y * settings.playerSpeed;

  // Boundary checks
  player.position.x = Math.max(0, Math.min(player.position.x, settings.fieldDimensions.width));
  player.position.y = Math.max(0, Math.min(player.position.y, settings.fieldDimensions.height));
}

export function checkCollisions(players: Player[], ball: Ball, settings: GameSettings) {
  const ballRadius = 5;
  const playerRadius = 15;

  // Check player-ball collisions
  players.forEach(player => {
    const dx = player.position.x - ball.position.x;
    const dy = player.position.y - ball.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ballRadius + playerRadius) {
      // Collision detected
      player.hasBall = true;

      // Update ball position to stick with player
      const angle = Math.atan2(dy, dx);
      ball.position.x = player.position.x - Math.cos(angle) * (ballRadius + playerRadius);
      ball.position.y = player.position.y - Math.sin(angle) * (ballRadius + playerRadius);

      // Transfer some of player's velocity to ball
      ball.velocity.x = player.velocity.x;
      ball.velocity.y = player.velocity.y;
    } else {
      player.hasBall = false;
    }
  });

  // Check for goals
  // Add goal detection logic here
}

export function isGoal(ball: Ball, settings: GameSettings): 'home' | 'away' | null {
  const goalWidth = 60;
  const goalY = settings.fieldDimensions.height / 2;
  const goalRange = 30;

  // Check left goal (home team scores)
  if (ball.position.x <= 0 && 
      Math.abs(ball.position.y - goalY) < goalRange) {
    return 'away';
  }

  // Check right goal (away team scores)
  if (ball.position.x >= settings.fieldDimensions.width && 
      Math.abs(ball.position.y - goalY) < goalRange) {
    return 'home';
  }

  return null;
}

export function createInitialPlayers(): Player[] {
  return [
    // Home team
    {
      id: 'home1',
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      team: 'home',
      isSelected: true,
      hasBall: false
    },
    {
      id: 'home2',
      position: { x: 200, y: 200 },
      velocity: { x: 0, y: 0 },
      team: 'home',
      isSelected: false,
      hasBall: false
    },
    {
      id: 'home3',
      position: { x: 200, y: 400 },
      velocity: { x: 0, y: 0 },
      team: 'home',
      isSelected: false,
      hasBall: false
    },

    // Away team
    {
      id: 'away1',
      position: { x: 700, y: 300 },
      velocity: { x: 0, y: 0 },
      team: 'away',
      isSelected: false,
      hasBall: false
    },
    {
      id: 'away2',
      position: { x: 600, y: 200 },
      velocity: { x: 0, y: 0 },
      team: 'away',
      isSelected: false,
      hasBall: false
    },
    {
      id: 'away3',
      position: { x: 600, y: 400 },
      velocity: { x: 0, y: 0 },
      team: 'away',
      isSelected: false,
      hasBall: false
    }
  ];
} 