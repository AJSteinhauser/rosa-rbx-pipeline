import { HTTPS_BODY_LIMIT } from "../models/constants.model"

const encodingService = game.GetService("EncodingService")

export class CompressionHandler {
  private constructor() {
    throw 'CompressionHandler is a static class, not instantiable'
  }

  public static compress(data: buffer): buffer | false {
    for (let compressionAmount = 1; compressionAmount < 22; compressionAmount+=5) {
      const compressed = encodingService.CompressBuffer(
        data,
        Enum.CompressionAlgorithm.Zstd,
        compressionAmount
      )
      const bufferSize = buffer.len(compressed)
      if (bufferSize < HTTPS_BODY_LIMIT) {
        return compressed
      }
    }
    return false
  }
}
