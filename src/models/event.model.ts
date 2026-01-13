
export interface Position {
  x: number;
  y: number;
  z: number;
};

export interface Event {
  eventId: string
  eventTimeStamp: number;
  sessionID: string;

  tag: string;
  platform: string
  position: Position;
  version: string;

  quantity?: number;
  teamId?: string;
  mapName?: string;

  custom?: Record<string, string | number>;
};

export interface EventRequest {
  tag: string
  quantity?: number
  custom: Event['custom']
}
