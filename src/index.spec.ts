import { join } from 'path';
import { createInstance, Pref as Pref1 } from './index';
import * as io from './utils/io';

describe('exports', () => {
  it('exports expected items', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const allExports = require('./index');
    expect(allExports).toHaveProperty('Pref');
    expect(allExports).toHaveProperty('getDefaultCrypto');
  });
});

describe('singleton instance', () => {
  it('Pref is a singleton instance', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Pref2 = require('./index').Pref;
    expect(Pref1).toBe(Pref2);
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  const createMockExists = (hasFile = false) =>
    jest.spyOn(io, 'existsOnDisk').mockImplementation(() => hasFile);
  const createMockRead = <S>(s?: S) => {
    const mock = jest.spyOn(io, 'readFromDisk');
    return s
      ? mock.mockImplementation(() => JSON.stringify(s))
      : mock.mockImplementation();
  };
  const createMockWrite = () =>
    jest.spyOn(io, 'writeToDisk').mockImplementation();

  it('does not throw error', () => {
    createMockExists();
    createMockRead();
    createMockWrite();
    expect(() =>
      createInstance({
        defaults: { a: 'memory' },
        ...SAFE_OPTIONS,
      })
    ).not.toThrow();
  });

  it('creates defaults and gets defaults but does not read or write', () => {
    createMockExists();
    const mockRead = createMockRead();
    const mockWrite = createMockWrite();

    const { get } = createInstance({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).not.toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();

    expect(get('a')).toBe('a');
  });

  it('reads and extends defaults', () => {
    createMockExists(true);
    const mockRead = createMockRead({ a: 'disk' });

    const { get } = createInstance({
      defaults: { a: 'default', b: 'b' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).toHaveBeenCalled();

    expect(get('a')).toBe('disk');
  });

  it("dose not write if state doesn't change", () => {
    createMockExists();
    createMockRead();
    const mockWrite = createMockWrite();

    const { set } = createInstance({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(mockWrite).not.toHaveBeenCalled();

    set('a', 'a');

    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('writes once state has changed', () => {
    createMockExists();
    createMockRead();
    const mockWrite = createMockWrite();

    const { set } = createInstance({
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
    createMockExists();
    createMockRead();

    const { filePath } = createInstance({
      defaults: { a: 'a' },
      ...SAFE_OPTIONS,
    });

    expect(filePath).toBe(join(SAFE_OPTIONS.dirPath, SAFE_OPTIONS.filename));
  });

  it('gets, sets, and resets key from state', () => {
    createMockExists();
    const mockRead = createMockRead();
    const mockWrite = createMockWrite();

    const { get, set, reset } = createInstance({
      defaults: { a: 'default' },
      ...SAFE_OPTIONS,
    });

    expect(mockRead).not.toHaveBeenCalled();
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
    expect(mockRead).not.toHaveBeenCalled();

    reset('a');

    expect(mockWrite).toHaveBeenCalledTimes(2);
    expect(mockWrite).toHaveBeenCalledWith(
      SAFE_OPTIONS.dirPath,
      SAFE_OPTIONS.filename,
      JSON.stringify({ a: 'default' })
    );
    expect(get('a')).toEqual('default');
    expect(mockRead).not.toHaveBeenCalled();
  });

  it('never writes when equality is `false`', () => {
    createMockExists();
    createMockRead();
    const mockWrite = createMockWrite();
    const { set, reset } = createInstance({
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
    createMockExists();
    createMockRead();
    const mockWrite = createMockWrite();
    const { set, reset } = createInstance({
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
