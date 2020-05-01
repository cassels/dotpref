import * as fs from 'fs';
import { createCrypto, getKey, SSH_KEY_PATH } from './crypto';

describe('crypto', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const STR = 'hello, world!';
  const SSH_MOCK_VALUE = 'SSH_MOCK_VALUE';
  const KEY_PATH_MOCK = '/path/to/dummy/key';
  const KEY_VALUE_MOCK = 'KEY_VALUE_MOCK';

  const { readFileSync, existsSync } = jest.requireActual('fs');

  const mockFS = (keyPathMap: { [keyPath: string]: string | boolean } = {}) => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(path =>
        keyPathMap[path as string]
          ? keyPathMap[path as string]
          : readFileSync(path)
      );
    jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(path =>
        keyPathMap[path as string] !== undefined
          ? !!keyPathMap[path as string]
          : existsSync(path)
      );
  };

  it('encode & decode with .ssh key', () => {
    const { encode, decode } = createCrypto();

    expect(decode(encode(STR))).toBe(STR);
  });

  it('encode & decode with keyPath', () => {
    mockFS({
      [KEY_PATH_MOCK]: KEY_VALUE_MOCK,
    });
    const { encode, decode } = createCrypto({ keyPath: KEY_PATH_MOCK });

    expect(decode(encode(STR))).toBe(STR);
  });

  describe('getKey', () => {
    it('w/o keyPath and w/o .ssh returns `PERF`', () => {
      mockFS({
        [SSH_KEY_PATH]: false,
      });
      expect(getKey()).toBe('PREF');
    });

    it('w/o keyPath and with .ssh returns .ssh', () => {
      mockFS({
        [SSH_KEY_PATH]: SSH_MOCK_VALUE,
      });
      expect(getKey()).toBe(SSH_MOCK_VALUE);
    });

    it('with invalid keyPath and with .ssh returns .ssh', () => {
      mockFS({
        [SSH_KEY_PATH]: SSH_MOCK_VALUE,
        [KEY_PATH_MOCK]: KEY_VALUE_MOCK,
      });
      expect(getKey()).toBe(SSH_MOCK_VALUE);
    });
    it('with valid keyPath and with .ssh returns .ssh', () => {
      mockFS({
        [SSH_KEY_PATH]: SSH_MOCK_VALUE,
        [KEY_PATH_MOCK]: KEY_VALUE_MOCK,
      });
      expect(getKey(KEY_PATH_MOCK)).toBe(KEY_VALUE_MOCK);
    });
  });
});
