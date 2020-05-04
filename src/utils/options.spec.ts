import { getOptions } from './options';
import { getSystemConfigPath } from './system';

describe('options', () => {
  it('getOptions returns correct defaults', () => {
    const NAME = 'jest';
    const dirPath = getSystemConfigPath(
      NAME,
      process.platform,
      process.env.XDG_CONFIG_HOME
    );
    const options = getOptions({ name: NAME });
    expect(options).toHaveProperty('defaults', {});
    expect(options).toHaveProperty('filename', 'config.pref');
    expect(options).toHaveProperty('name', NAME);
    expect(options).toHaveProperty('dirPath', dirPath);
    expect(options).toHaveProperty('encoder');
    expect(options).toHaveProperty('decoder');
    expect(options).toHaveProperty('serializer');
    expect(options).toHaveProperty('deserializer');
    expect(options).toHaveProperty('setter');
    expect(options).toHaveProperty('getter');
    expect(options).toHaveProperty('equality');
    // TODO: `watch`
    // expect(options).toHaveProperty('watch', false);
  });
  it('getOptions returns overrides', () => {
    const options = getOptions({
      name: 'testName',
      dirPath: 'testDirPath',
      defaults: { a: 'a' },
      // TODO: `watch`
      // watch: true,
      filename: 'abc.test',
      encoder: s => s,
      decoder: s => s,
      serializer: s => `${s}`,
      deserializer: () => ({ a: 'a' }),
      setter: () => ({ a: 'a' }),
      getter: () => 'a',
      equality: () => true,
    });

    expect(options).toEqual(options);
  });
});
