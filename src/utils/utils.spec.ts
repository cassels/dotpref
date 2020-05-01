import { normalizeId, pad } from './utils';

describe('utils', () => {
  it.each([
    ['6chars', '6charscom.example.abccom.example'],
    ['32charsXXXXXXXXXXXXXXXXXXXXXXXXX', '32charsXXXXXXXXXXXXXXXXXXXXXXXXX'],
    [
      '64charsXXXXXXXXXXXXXXXXXXXXXXXXX00000000000000000000000000000000',
      '64charsXXXXXXXXXXXXXXXXXXXXXXXXX',
    ],
  ])('pad `%s` to `%s`', (input, expected) => {
    expect(pad(input, 'com.example.abc')).toBe(expected);
  });

  it.each([
    ['hello world', 'hello.world'],
    ['hello_world', 'hello_world'],
    ['hello-world', 'hello-world'],
    ['hello..world', 'hello.world'],
    ['.hello.world.', '.hello.world'],
    ['.hello.world.pref', '.hello.world'],
    ['hello!@£$%^&*()¡€#¢∞§¶•ªº~`<>,?/;:\'"|\\}]{[+=world', 'hello.world'],
  ])('normalize %s', (input, expected) => {
    expect(normalizeId(input)).toBe(expected);
  });
});
