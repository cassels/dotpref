import * as fs from 'fs';
import {
  createPreferences,
  CreatePreferencesOptions,
  DEFAULT_PATH,
  getDefaults,
} from './index';
import { SSH_KEY_PATH } from './utils/crypto';

const SSH_MOCK_VALUE = 'SSH_MOCK_VALUE';

const mockFS = () => {
  let tmp: string = undefined;
  jest.spyOn(fs, 'mkdirSync').mockImplementation(() => '');
  jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
    if (tmp) {
      return tmp;
    } else if (path === SSH_KEY_PATH) {
      return SSH_MOCK_VALUE;
    }
    throw new Error();
  });
  jest
    .spyOn(fs, 'writeFileSync')
    .mockImplementation((path: string, value: string) => (tmp = value));
};

describe('getDefaults', () => {
  it('return the expect defaults', () => {
    expect(getDefaults()).toEqual({
      dirPath: DEFAULT_PATH,
      format: 'JSON',
      keyPath: SSH_KEY_PATH,
    } as CreatePreferencesOptions);
  });
  it('override expected defaults', () => {
    expect(
      getDefaults({
        dirPath: 'a/b/c',
        format: 'JSON',
        keyPath: 'k/e/y',
      })
    ).toEqual({
      dirPath: 'a/b/c',
      format: 'JSON',
      keyPath: 'k/e/y',
    } as CreatePreferencesOptions);
  });
});
describe('createPreference', () => {
  it('getPreferences defaults to empty object', () => {
    mockFS();
    const { getPreferences } = createPreferences('com.example');
    expect(getPreferences()).toEqual({});
  });
  it('getPreferences defaults to `default` object', () => {
    mockFS();
    const { getPreferences } = createPreferences('com.example', { a: 'a' });
    expect(getPreferences()).toEqual({ a: 'a' });
  });

  it('reads and writes to disk', () => {
    mockFS();
    const { setPreferences, getPreferences } = createPreferences(
      'com.example',
      { a: 'a' },
      { dirPath: 'a/b/c' }
    );
    setPreferences({
      a: 'Hello, World!',
    });
    expect(getPreferences()).toEqual({ a: 'Hello, World!' });

    expect(fs.mkdirSync).toBeCalledTimes(1);
    expect(fs.writeFileSync).toBeCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'a/b/c/com.example.pref',
      expect.any(String),
      expect.anything()
    );
    expect(fs.readFileSync).toHaveBeenLastCalledWith(
      'a/b/c/com.example.pref',
      expect.anything()
    );
  });

  it('subscribe', () => {
    const { setPreferences, subscribe } = createPreferences('com.example');

    const mockObserver = jest.fn(() => ({}));
    const mockHandler = subscribe(mockObserver);

    setPreferences({ a: 'a' });
    mockHandler();
    setPreferences({ a: 'b' });

    expect(mockObserver).toBeCalledTimes(1);
    expect(mockObserver).toBeCalledWith({ a: 'a' });
  });
});
