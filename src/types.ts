type WritableValue =
  | string
  | number
  | boolean
  | WritableValue[]
  | { [key: string]: WritableValue };

export interface AnyState {
  [key: string]: WritableValue;
}

export type Serializer<S extends AnyState> = (state: S) => string;
export type Deserializer<S extends AnyState> = (state: string) => S;
export type Setter<S extends AnyState> = <K extends keyof S>(
  state: S,
  key: K,
  value: S[K]
) => S;
export type Getter<S extends AnyState> = <K extends keyof S>(
  state: S,
  key: K
) => S[K];
export type Equality<S extends AnyState> = (state: S, newState: S) => boolean;
export interface DotPrefOptions<S extends AnyState> {
  defaults: S;
  name: string;
  filename: string;
  dirPath: string;
  serializer: Serializer<S>;
  deserializer: Deserializer<S>;
  encoder: (decodedString: string) => string;
  decoder: (encodedString: string) => string;
  setter: Setter<S>;
  getter: Getter<S>;
  equality: Equality<S> | boolean;
  // TODO: `watch`;
  // watch: boolean;
}
