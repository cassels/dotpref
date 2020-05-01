import { AnyState } from '../types';

type SerializerFormat = 'JSON';

export interface SerializerConfig {
  format: SerializerFormat;
}

export const SERIALIZER_DEFAULTS: SerializerConfig = {
  format: 'JSON',
};

export const createSerializer = <P extends AnyState = AnyState>({
  format,
}: SerializerConfig) => {
  const serializeJSON = (data: Partial<P>): string => JSON.stringify(data);

  const deserializeJSON = (text: string): Partial<P> => JSON.parse(text);

  const serialize = (data: Partial<P>): string => {
    switch (format) {
      case 'JSON':
      default:
        return serializeJSON(data);
    }
  };

  const deserialize = (text: string): Partial<P> => {
    switch (format) {
      case 'JSON':
      default:
        return deserializeJSON(text);
    }
  };

  return {
    serialize,
    deserialize,
  };
};
