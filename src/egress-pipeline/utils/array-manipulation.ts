import { HttpService } from "@rbxts/services"


export function splitArrayInHalf<T extends defined>(array: T[]): [T[], T[]] {
  const size = array.size()
  const mid = math.floor(size / 2)

  const left = array.move(1, mid, 1, [])
  const right = array.move(mid + 1, size, 1, [])

  return [left, right]
}
