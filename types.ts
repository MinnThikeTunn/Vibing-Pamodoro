
export enum TimerMode {
  NORMAL = 'NORMAL',
  VIBING = 'VIBING'
}

export enum TimerPhase {
  WORK = 'WORK',
  REST = 'REST',
  IDLE = 'IDLE'
}

export interface TimerState {
  mode: TimerMode;
  phase: TimerPhase;
  isRunning: boolean;
  elapsedSeconds: number;
  totalWorkSeconds: number;
  currentCycle: number;
  totalCycles: number;
  showSummary: boolean;
  lastCalculatedRest: number;
  lastVibedSeconds: number; // New field to freeze the session time
}
