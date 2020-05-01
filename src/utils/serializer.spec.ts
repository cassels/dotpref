import { createSerializer } from './serializer';

describe('serializer', () => {
  it('serializeJSON', () => {
    const { serialize } = createSerializer({
      format: 'JSON',
    });

    const pref = {
      hello: 'world',
    };

    const serialized = serialize(pref);

    expect(typeof serialized).toBe('string');
    expect(JSON.parse(serialized)).toEqual(pref);
  });
  it('deserializeJSON', () => {
    const { deserialize } = createSerializer({
      format: 'JSON',
    });

    const str = `{"hello":"world"}`;

    const deserialized = deserialize(str);

    expect(typeof deserialized).toBe('object');
    expect(deserialized).toHaveProperty('hello', 'world');
    expect(JSON.stringify(deserialized)).toEqual(str);
  });
});
