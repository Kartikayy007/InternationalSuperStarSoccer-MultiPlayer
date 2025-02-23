export interface Player {
  id: string;
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
  images: {
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
  };
}

export interface Ball {
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
}

export interface GameState {
  input: InputHandler;
  brazil: Player[];
  argentina: Player[];
  oncontrol: Player | null;
  defensiveRadius: number;
  argentinaPossessionTimer: number;
  argentinaPassInterval: number;
  score: {
    brazil: number;
    argentina: number;
  };
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
}

export class InputHandler {
  keys: string[];
  lastkey: string;

  constructor() {
    this.keys = [];
    this.lastkey = '';

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', () => {
        this.keys = [];
      });
      
      window.addEventListener('keydown', (e) => {
        if ((e.key === 'w' ||
            e.key === 'a' ||
            e.key === 's' ||
            e.key === 'd' ||
            e.key === ' ') &&
            this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
        }
        if (e.key === ' ') {
          this.lastkey = 'Space';
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.key === 'w' ||
            e.key === 'a' ||
            e.key === 's' ||
            e.key === 'd' ||
            e.key === ' ' ||
            e.key === 'Shift') {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }
}

export interface GameSettings {
  fieldDimensions: {
    width: number;
    height: number;
  };
  playerSpeed: number;
  ballSpeed: number;
  kickPower: number;
}

export type GameAction = 
  | { type: 'MOVE_PLAYER'; payload: { playerId: string; direction: { x: number; y: number } } }
  | { type: 'KICK_BALL'; payload: { direction: { x: number; y: number } } }
  | { type: 'SELECT_PLAYER'; payload: { playerId: string } }
  | { type: 'SCORE_GOAL'; payload: { team: 'home' | 'away' } }
  | { type: 'TOGGLE_PAUSE' }; 