import { equality, getter, setter } from './reducer';

describe('reducer', () => {
  it('setter returns the new state', () => {
    const state = { a: 'a' };
    const newState = setter(state, 'a', 'b');
    expect(newState).not.toBe(state);
    expect(newState).not.toEqual(state);
    expect(newState).toEqual({ a: 'b' });
  });
  it('setter returns same state if not change', () => {
    const state = { a: 'a' };
    const newState = setter(state, 'a', 'a');
    expect(newState).toBe(state);
  });
  it('getter returns the correct value', () => {
    const a = { b: 'b' };
    expect(getter({ a }, 'a')).toBe(a);
  });
  it('equality returns true for identity', () => {
    const a = { a: 'a' };
    expect(equality(a, a)).toBe(true);
  });
  it('equality returns false for equality', () => {
    const a = { a: 'a' };
    expect(equality(a, { ...a })).toBe(false);
  });
});
