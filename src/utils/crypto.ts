import {
  createCipheriv,
  createDecipheriv,
  createHash,
  HexBase64BinaryEncoding,
  randomBytes,
  Utf8AsciiBinaryEncoding,
} from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface CryptoConfig {
  keyPath?: string;
}

export const INPUT_ENCODING: Utf8AsciiBinaryEncoding = 'utf8';
export const OUTPUT_ENCODING: HexBase64BinaryEncoding = 'hex';

export const SSH_KEY_PATH = join(homedir(), '.ssh', 'id_rsa');

export const CRYPTO_DEFAULTS: CryptoConfig = {
  keyPath: SSH_KEY_PATH,
};

const readKey = (keyPath?: string) =>
  existsSync(keyPath) && readFileSync(keyPath).toString(INPUT_ENCODING);

export const getKey = (keyPath?: string) =>
  readKey(keyPath) || readKey(SSH_KEY_PATH) || 'PREF';

export const createCrypto = ({ keyPath }: CryptoConfig = {}) => {
  const key = getKey(keyPath);

  const encryptedKey = createHash('sha256').update(key).digest();

  const encode = (text: string): string => {
    const iv = randomBytes(8).toString(OUTPUT_ENCODING);
    const cipher = createCipheriv('aes256', encryptedKey, iv);
    const encrypted =
      cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING) +
      cipher.final(OUTPUT_ENCODING);
    return `${iv.toString()}:${encrypted.toString()}`;
  };

  const decode = (text: string): string => {
    const [ivString, encrypted] = text.split(':');
    const decipher = createDecipheriv('aes256', encryptedKey, ivString);
    return (
      decipher.update(encrypted, OUTPUT_ENCODING, INPUT_ENCODING) +
      decipher.final(INPUT_ENCODING)
    );
  };

  return {
    encode,
    decode,
  };
};
