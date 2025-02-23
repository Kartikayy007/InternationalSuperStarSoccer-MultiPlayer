'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { GameState, GameAction, GameSettings } from '@/types/game';

const defaultSettings: GameSettings = {
  fieldDimensions: { width: 800, height: 600 },
  playerSpeed: 5,
  ballSpeed: 8,
  kickPower: 15
};

const initialState: GameState = {
  players: [],
  ball: {
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 },
    isKicked: false
  },
  score: { home: 0, away: 0 },
  gameTime: 0,
  isPaused: false
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PLAYER':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId
            ? {
                ...player,
                velocity: action.payload.direction
              }
            : player
        )
      };
    case 'KICK_BALL':
      return {
        ...state,
        ball: {
          ...state.ball,
          velocity: action.payload.direction,
          isKicked: true
        }
      };
    case 'SELECT_PLAYER':
      return {
        ...state,
        players: state.players.map(player => ({
          ...player,
          isSelected: player.id === action.payload.playerId
        }))
      };
    case 'SCORE_GOAL':
      return {
        ...state,
        score: {
          ...state.score,
          [action.payload.team]: state.score[action.payload.team] + 1
        }
      };
    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused
      };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  settings: GameSettings;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch, settings: defaultSettings }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 