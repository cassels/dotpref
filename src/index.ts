import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { AnyState, PreferenceObserver, PreferenceStore } from './types';
import {
  createCrypto,
  CryptoConfig,
  CRYPTO_DEFAULTS,
  INPUT_ENCODING,
} from './utils/crypto';
import {
  createSerializer,
  SerializerConfig,
  SERIALIZER_DEFAULTS,
} from './utils/serializer';
import { normalizeId } from './utils/utils';

export const DEFAULT_PATH = join(homedir(), '.config', 'preferences');

export type CreatePreferencesOptions = {
  dirPath: string;
} & SerializerConfig &
  CryptoConfig;

export const getDefaults = (
  options: Partial<CreatePreferencesOptions> = {}
): CreatePreferencesOptions => ({
  dirPath: DEFAULT_PATH,
  ...CRYPTO_DEFAULTS,
  ...SERIALIZER_DEFAULTS,
  ...options,
});

export const createPreferences = <S extends AnyState>(
  id: string,
  defaults: S = {} as S,
  options: Partial<CreatePreferencesOptions> = {}
): PreferenceStore<S> => {
  const { dirPath, keyPath, format } = getDefaults(options);

  let observers: PreferenceObserver[] = [];

  const identifier = normalizeId(id);

  const filePath = join(dirPath, identifier + '.pref');

  const serializer = createSerializer<S>({
    format,
  });

  const crypto = createCrypto({
    keyPath,
  });

  const getPreferences = (): Readonly<Partial<S>> => {
    try {
      const encrypted = readFileSync(filePath, INPUT_ENCODING);
      const text = crypto.decode(encrypted);
      return serializer.deserialize(text);
    } catch (e) {
      return defaults;
    }
  };

  const setPreferences = (preferences: Partial<S>) => {
    const data = serializer.serialize(preferences);
    const payload = crypto.encode(data);
    mkdirSync(dirPath, { recursive: true, mode: parseInt('0700', 8) });
    writeFileSync(filePath, payload, { mode: parseInt('0600', 8) });
    notifyObservers();
  };

  const notifyObservers = () => {
    observers.forEach(observer => observer(getPreferences()));
  };

  const subscribe = (observer: PreferenceObserver<S>) => {
    const originalObservers = [...observers];
    observers = [...originalObservers, observer];
    return () => {
      observers = [...originalObservers];
    };
  };

  return {
    getPreferences,
    setPreferences,
    subscribe,
  };
};
