import * as mem from 'mem';
import * as pkgUp from 'pkg-up';
import { AnyState, DotPrefOptions } from '../types';

export const pad = (text: string, padding: string): string =>
  text.padEnd(32, padding).slice(0, 32);

export const normalizeId = (id: string) =>
  id
    .replace(/[^a-zA-Z0-9-_]+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/\.$|\.pref$/g, '');

export const shouldWrite = <S extends AnyState>(
  equality: DotPrefOptions<S>['equality'],
  state: S,
  newState: S
) => (typeof equality === 'function' ? !equality(state, newState) : equality);

export const getPackageData = mem((cwd: string) => {
  const packagePath = pkgUp.sync({ cwd });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageData = require(packagePath);
  return packageData || {};
});
