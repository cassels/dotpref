import { dirname, join } from 'path';
import { AnyState, DotPref, DotPrefOptions } from './types';
import { readFromDisk, writeToDisk } from './utils/io';
import { getOptions } from './utils/options';
import { PartialPick } from './utils/types';
import { getPackageData, normalizeId, shouldWrite } from './utils/utils';

export * from './types';
export { getDefaultCrypto } from './utils/crypto';

/**
 * Returns the directory of the caller by finding the directory of
 * module.parent. To do this we need to prevent require from caching
 * this module and suppress NodeJS warnings.
 */
const getModuleParentDir = () => {
  const warn = console.warn;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.warn = () => {};
  delete require.cache[__filename];
  console.warn = warn;
  return dirname((module.parent && module.parent.filename) || '.');
};

let instance: DotPref<AnyState>;
const getInstance = (): DotPref<AnyState> => {
  if (!instance) {
    instance = createPref<AnyState>({
      defaults: {},
    });
  }
  return instance;
};

/**
 * Default instance of .pref
 */
export const Pref: DotPref<AnyState> = {
  get: key => getInstance().get(key),
  set: (key, value) => getInstance().set(key, value),
  reset: key => getInstance().reset(key),
  read: () => getInstance().read(),
  write: () => getInstance().write(),
  filePath: '',
};

Object.defineProperty(Pref, 'filePath', {
  enumerable: true,
  get: () => getInstance().filePath,
});

/**
 * Create custom instance of .pref.
 */
export function createPref<S extends AnyState>({
  name,
  ...options
}: PartialPick<DotPrefOptions<S>, 'defaults'>): DotPref<S> {
  const parentPackageData = getPackageData(getModuleParentDir());
  const defaultName = parentPackageData.name;

  const {
    defaults,
    filename,
    dirPath,
    serializer,
    deserializer,
    encoder,
    decoder,
    setter,
    getter,
    equality,
  } = getOptions({ ...options, name: normalizeId(name || defaultName) });

  // TODO: implement watch
  let state: S;

  const get = <K extends keyof S>(key: K): S[K] => getter(state, key);

  const set = <K extends keyof S>(key: K, value: S[K]) => {
    const oldState = state;
    state = setter(state, key, value);
    // TODO: notify SET.
    if (shouldWrite(equality, oldState, state)) {
      write();
    }
  };

  const reset = <K extends keyof S>(key: K) => {
    set(key, defaults[key]);
  };

  const read = () => {
    try {
      const encryptedData = readFromDisk(dirPath, filename);
      const serializedData = decoder(encryptedData);
      state = { ...defaults, ...deserializer(serializedData) };
      // TODO: notify READ
    } catch (e) {
      state = { ...defaults };
    }
  };

  const write = () => {
    const serializedData = serializer(state);
    const encryptedData = encoder(serializedData);
    writeToDisk(dirPath, filename, encryptedData);
    // TODO: notify WRITE
  };

  // TODO: implement on
  // const on = () => {};

  // TODO: implement migrate
  // const migrate = () => {};

  const api = {
    get,
    set,
    reset,
    write,
    read,
    filePath: join(dirPath, filename),
    // on,
    // migrate,
  };

  Object.defineProperty(api, 'filePath', {
    writable: false,
    enumerable: true,
    value: join(dirPath, filename),
  });

  read();

  return api;
}
