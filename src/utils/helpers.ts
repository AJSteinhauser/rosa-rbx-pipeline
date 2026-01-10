import { Position } from "../models/event.model"

export const vector3ToPosition = (vector3: Vector3): Position => {
  return {
    x: vector3.X,
    y: vector3.Y,
    z: vector3.Z
  }
}
