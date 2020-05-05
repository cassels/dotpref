import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { sync as writeAtomic } from 'write-file-atomic';

export const writeToDisk = (
  dirPath: string,
  filename: string,
  payload: string
): void => {
  const filePath = join(dirPath, filename);
  mkdirSync(dirPath, { recursive: true, mode: parseInt('0700', 8) });
  writeAtomic(filePath, payload, { mode: parseInt('0600', 8) });
};

export const readFromDisk = (dirPath: string, filename: string): string => {
  const filePath = join(dirPath, filename);
  return readFileSync(filePath, 'utf8');
};
