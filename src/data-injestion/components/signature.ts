import { HttpService } from "@rbxts/services"
import { Headers } from "../models/signature.model"
import { SECRETS_KEY_LOOKUP } from "../models/constants.model"

const encodingService = game.GetService("EncodingService")

export class Signature {
  private constructor() {
    throw 'Signature is a static class, not instantiable'
  }

  static generateHeader(): Headers {
    const apiKey = HttpService.GetSecret(SECRETS_KEY_LOOKUP)
    return {
      "api-secret": apiKey,
      "idempotency-key": HttpService.GenerateGUID(false),
    }
  }

  // Once roblox implements a way to hash secrets this can be valid 
  //
  // static generateHeader(buffer: buffer): Headers {
  //   const timestamp = os.time()
  //   const nonce = math.floor(math.random() * 256)
  //   const bodyHash = encodingService.ComputeBufferHash(buffer, Enum.HashAlgorithm.Sha256)
  //   const apiKey = HttpService.GetSecret(SECRETS_KEY_LOOKUP)
  //
  //   const suffix = `${timestamp}+${nonce}+${bodyHash}`
  //   apiKey.AddSuffix(suffix)
  //
  //
  //   const signature = encodingService.ComputeStringHash(apiKey, Enum.HashAlgorithm.Sha256)
  //
  //   return {
  //     "Rosa-Signature": signature,
  //     "Rosa-Timestamp": timestamp,
  //     "Rosa-Nonce": nonce,
  //   }
  // }
}
