import { AES, enc } from "crypto-js"

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY

export const encrypt = (text: string): string => {
  return AES.encrypt(text, SECRET_KEY!).toString()
}

export const decrypt = (ciphertext: string): string => {
  const bytes = AES.decrypt(ciphertext, SECRET_KEY!)
  return bytes.toString(enc.Utf8)
}

