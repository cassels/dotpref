import { AnyState } from '../types';

export const setter = <S extends AnyState, K extends keyof S>(
  state: S,
  key: K,
  value: S[K]
): S => {
  const currentValue = getter(state, key);
  if (currentValue !== value) {
    return {
      ...state,
      [key]: value,
    };
  }
  return state;
};

export const getter = <S extends AnyState, K extends keyof S>(
  state: S,
  key: K
): S[K] => state[key];

export const equality = (state: any, newState: any) => state === newState;
