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
  defaultKey?: string;
}

export const INPUT_ENCODING: Utf8AsciiBinaryEncoding = 'utf8';
export const OUTPUT_ENCODING: HexBase64BinaryEncoding = 'hex';

export const SSH_KEY_PATH = join(homedir(), '.ssh', 'id_rsa');

const readKey = (keyPath: string) =>
  existsSync(keyPath) && readFileSync(keyPath).toString(INPUT_ENCODING);

export const getKey = ({ keyPath, defaultKey = 'PREF' }: CryptoConfig = {}) =>
  readKey(keyPath) || readKey(SSH_KEY_PATH) || defaultKey;

export const getDefaultCrypto = (config: CryptoConfig = {}) => {
  const key = getKey(config);

  const encryptedKey = createHash('sha256').update(key).digest();

  const encoder = (text: string): string => {
    const iv = randomBytes(8).toString(OUTPUT_ENCODING);
    const cipher = createCipheriv('aes256', encryptedKey, iv);
    const encrypted =
      cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING) +
      cipher.final(OUTPUT_ENCODING);
    return `${iv.toString()}:${encrypted.toString()}`;
  };

  const decoder = (text: string): string => {
    const [ivString, encrypted] = text.split(':');
    const decipher = createDecipheriv('aes256', encryptedKey, ivString);
    return (
      decipher.update(encrypted, OUTPUT_ENCODING, INPUT_ENCODING) +
      decipher.final(INPUT_ENCODING)
    );
  };

  return {
    encoder,
    decoder,
  };
};
