import { homedir } from 'os';
import { join } from 'path';
import { getSystemConfigPath } from './system';
describe('system', () => {
  const NAME = 'Test';
  const HOME = homedir();
  it('returns correct macOS config path', () => {
    expect(getSystemConfigPath(NAME, 'darwin')).toBe(
      join(HOME, 'Library', 'Preferences', NAME)
    );
  });
  it('returns correct Windows config path', () => {
    expect(getSystemConfigPath(NAME, 'win32')).toBe(
      join(HOME, 'AppData', 'Roaming', NAME, 'Config')
    );
  });
  it.each([
    'aix',
    'android',
    'cygwin',
    'freebsd',
    'linux',
    'netbsd',
    'openbsd',
    'sunos',
  ] as NodeJS.Platform[])('returns correct %s config path', platform => {
    expect(getSystemConfigPath(NAME, platform)).toBe(
      join(HOME, '.config', NAME)
    );
  });
  it('returns correct override config path', () => {
    expect(getSystemConfigPath(NAME, 'linux', '/my/override/path')).toBe(
      join('/my/override/path', NAME)
    );
  });
});
