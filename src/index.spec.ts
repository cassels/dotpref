import { join } from 'path';
import { createPref, Pref } from './index';
import * as io from './utils/io';

const mockRead = jest.spyOn(io, 'readFromDisk').mockImplementation();
const mockWrite = jest.spyOn(io, 'writeToDisk').mockImplementation();

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  mockRead.mockImplementation();
  mockWrite.mockImplementation();
});

describe('exports', () => {
  it('exports expected items', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const allExports = require('./index');
    expect(allExports).toHaveProperty('Pref');
    expect(allExports).toHaveProperty('getDefaultCrypto');
  });
});

describe('singleton instance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Pref is a singleton instance', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Pref2 = require('./index').Pref;
    expect(Pref).toBe(Pref2);
  });

  it('sets, gets, resets', () => {
    expect(Pref.get('foo')).toBe(undefined);

    Pref.set('foo', 'bar');
    expect(mockWrite).toHaveBeenLastCalledWith(
      Pref.filePath.replace('/config.pref', ''),
      'config.pref',
      expect.any(String)
    );

    expect(Pref.get('foo')).toBe('bar');

    Pref.reset('foo');
    expect(mockWrite).toHaveBeenLastCalledWith(
      Pref.filePath.replace('/config.pref', ''),
      'config.pref',
      expect.any(String)
    );

    expect(Pref.get('foo')).toBe(undefined);

    expect(mockWrite).toBeCalledTimes(2);
    expect(mockRead).toBeCalledTimes(1);
  });

  it('writes, reads', () => {
    let file: string;
    mockWrite.mockImplementation((dir, name, text) => {
      file = text;
    });

    Pref.write();
    expect(mockWrite).toBeCalledTimes(1);
    expect(mockWrite).toBeCalledWith(
      Pref.filePath.replace('/config.pref', ''),
      'config.pref',
      expect.any(String)
    );

    mockRead.mockReturnValueOnce(file);
    Pref.read();
    expect(mockRead).toBeCalledTimes(1);
    expect(mockRead).toReturnWith(expect.any(String));
  });
});

describe('create instance', () => {
  const encoder = (s: string) => s;
  const decoder = (s: string) => s;
  const SAFE_OPTIONS = {
    name: 'com.example.test',
    dirPath: './dir/path',
    filename: 'test.pref',
    encoder,
    decoder,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not throw error', () => {
    expect(() =>
      createPref({
        defaults: { a: 'memory' },
        ...SAFE_OPTIONS,
      })
    ).not.toThrow();
  });

  it('creates defaults and gets defaults', () => {
    mockRead.mockImplementationOnce(() => {
      throw new Error();
    });
    const { get } = createPref({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockRead).not.toReturn();
    expect(mockWrite).not.toHaveBeenCalled();

    expect(get('a')).toBe('a');
  });

  it('falls back on defaults if error', () => {
    mockRead.mockReturnValueOnce('not encrypted text');

    const { get } = createPref({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });
    expect(mockRead).toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();

    expect(get('a')).toBe('a');
  });

  it('reads and extends defaults', () => {
    mockRead.mockReturnValueOnce(JSON.stringify({ a: 'disk' }));

    const { get } = createPref({
      defaults: { a: 'default', b: 'b' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).toHaveBeenCalled();

    expect(get('a')).toBe('disk');
  });

  it("dose not write if state doesn't change", () => {
    const { set } = createPref({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(mockWrite).not.toHaveBeenCalled();

    set('a', 'a');

    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('writes once state has changed', () => {
    const { set } = createPref({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(mockWrite).not.toHaveBeenCalled();

    set('a', 'b');

    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledWith(
      SAFE_OPTIONS.dirPath,
      SAFE_OPTIONS.filename,
      expect.any(String)
    );
  });

  it('filePath exists and is overwritten', () => {
    const { filePath } = createPref({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(filePath).toBe(join(SAFE_OPTIONS.dirPath, SAFE_OPTIONS.filename));
  });

  it('gets, sets, and resets key from state', () => {
    const { get, set, reset } = createPref({
      defaults: { a: 'default' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).toHaveBeenCalledTimes(1);
    expect(mockWrite).not.toHaveBeenCalled();
    expect(get('a')).toEqual('default');

    set('a', 'disk');

    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockWrite).toHaveBeenCalledWith(
      SAFE_OPTIONS.dirPath,
      SAFE_OPTIONS.filename,
      JSON.stringify({ a: 'disk' })
    );
    expect(get('a')).toEqual('disk');
    expect(mockRead).toHaveBeenCalledTimes(1);

    reset('a');

    expect(mockWrite).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledWith(
      SAFE_OPTIONS.dirPath,
      SAFE_OPTIONS.filename,
      JSON.stringify({ a: 'default' })
    );
    expect(get('a')).toEqual('default');
    expect(mockRead).toHaveBeenCalledTimes(1);
  });

  it('never writes when equality is `false`', () => {
    const { set, reset } = createPref({
      defaults: { a: 'default' },
      ...SAFE_OPTIONS,
      equality: false,
    });

    set('a', 'b');
    set('a', 'c');
    set('a', 'd');
    set('a', 'e');
    reset('a');

    expect(mockWrite).not.toBeCalled();
  });

  it('always writes when equality is `true`', () => {
    const { set, reset } = createPref({
      defaults: { a: 'default' },
      ...SAFE_OPTIONS,
      equality: true,
    });

    set('a', 'b');
    set('a', 'c');
    set('a', 'd');
    set('a', 'e');
    reset('a');

    expect(mockWrite).toBeCalledTimes(5);
  });
});
