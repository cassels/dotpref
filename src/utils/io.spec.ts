import * as fs from 'fs';
import * as atomic from 'write-file-atomic';
import { existsOnDisk, readFromDisk, writeToDisk } from './io';

describe('io', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('reads from file', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'test contents');
    expect(readFromDisk('./tmp', 'test')).toBe('test contents');
  });

  it('checks existence of file', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    expect(existsOnDisk('./tmp', 'test')).toBe(true);
  });

  it('writes to file', () => {
    const mkdirMock = jest.spyOn(fs, 'mkdirSync').mockImplementation();
    const atomicMock = jest.spyOn(atomic, 'sync').mockImplementation();
    writeToDisk('./tmp', 'test', 'test contents');
    expect(mkdirMock).toBeCalledTimes(1);
    expect(atomicMock).toBeCalledTimes(1);
  });
});
