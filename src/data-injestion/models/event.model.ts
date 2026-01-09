
export type Position = {
  x: number;
  y: number;
  z: number;
};

export type Event = {
  tag: string;
  position: Position;
  eventTimeStamp: number;
  playerId: string;

  platform: string
  quantity?: number;
  teamId?: string;
  mapName?: string;
  version?: string;

  custom?: Record<string, any>;
};
