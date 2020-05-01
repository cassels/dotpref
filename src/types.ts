type WritableValue =
  | string
  | number
  | boolean
  | WritableValue[]
  | { [key: string]: WritableValue };

export interface AnyState {
  [key: string]: WritableValue;
}

export type PreferenceObserver<State extends AnyState = {}> = (
  preferences: State
) => void;

export type PreferenceStore<State extends AnyState = {}> = {
  readonly getPreferences: () => Readonly<Partial<State>>;
  readonly setPreferences: (preferences: Partial<State>) => void;
  readonly subscribe: (observer: PreferenceObserver<State>) => () => void;
};
