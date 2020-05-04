import { homedir } from 'os';
import { join } from 'path';

const getMacOSConfigPath = (name: string) => {
  return join(homedir(), 'Library', 'Preferences', name);
};

const getWindowsConfigPath = (name: string) => {
  return join(homedir(), 'AppData', 'Roaming', name, 'Config');
};

const getLinuxConfigPath = (name: string, path?: string) => {
  if (path) {
    return join(path, name);
  }
  return join(homedir(), '.config', name);
};

export const getSystemConfigPath = (
  name: string,
  platform?: NodeJS.Platform,
  xdgConfigHome?: string
) => {
  if (platform === 'darwin') {
    return getMacOSConfigPath(name);
  }

  if (platform === 'win32') {
    return getWindowsConfigPath(name);
  }

  return getLinuxConfigPath(name, xdgConfigHome);
};
