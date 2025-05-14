export interface Player {
  id: number;
  name: string;
}

export interface Match {
  round: number;
  player1: number;
  player2: number;
  date?: string; // ISO date string
}

export interface Tournament {
  playerCount: number;
  playTwice: boolean;
  players: Player[];
  matches: Match[];
  startDate?: string; // ISO date string
  matchesPerDay: number;
  weekType: 'normal' | 'workweek' | 'weekend';
  selectedDays: string[]; // e.g., ["Monday", "Tuesday"]
  isFullWeek: boolean;
}