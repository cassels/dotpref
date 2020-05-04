import type { AnyState, DotPrefOptions } from '../types';
import { getDefaultCrypto } from './crypto';
import { equality, getter, setter } from './reducer';
import { getSystemConfigPath } from './system';
import { PartialPick } from './types';

export function getOptions<S extends AnyState>({
  name,
  ...overrides
}: PartialPick<DotPrefOptions<S>, 'name'>): DotPrefOptions<S> {
  const { encoder, decoder } = getDefaultCrypto();

  return {
    name,
    defaults: {} as S,
    filename: 'config.pref',
    dirPath: getSystemConfigPath(
      name,
      process.platform,
      process.env.XDG_CONFIG_HOME
    ),
    serializer: JSON.stringify,
    deserializer: JSON.parse,
    encoder,
    decoder,
    setter,
    getter,
    equality,
    // watch: false,
    ...overrides,
  };
}
