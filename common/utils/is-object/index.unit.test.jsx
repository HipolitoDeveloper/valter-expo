import isObject from '.';

describe('isObject', () => {
  it('should return true if an object is provided', () => {
    const object = {};
    expect(isObject(object)).toBe(true);

    const objectWithUndefined = { foo: undefined };
    expect(isObject(objectWithUndefined)).toBe(true);

    const objectFull = { foo: 'bar' };
    expect(isObject(objectFull)).toBe(true);
  });

  it('should return false if a nullish value is provided', () => {
    const nullValue = null;
    expect(isObject(nullValue)).toBe(false);

    const undefinedValue = undefined;
    expect(isObject(undefinedValue)).toBe(false);
  });

  it('should return false if a string is provided', () => {
    const string = '';
    expect(isObject(string)).toBe(false);

    const stringFull = 'something';
    expect(isObject(stringFull)).toBe(false);
  });

  it('should return false if a boolean is provided', () => {
    const trueValue = true;
    expect(isObject(trueValue)).toBe(false);

    const falseValue = false;
    expect(isObject(falseValue)).toBe(false);
  });

  it('should return false if a number is provided', () => {
    const zero = 0;
    expect(isObject(zero)).toBe(false);

    const one = 1;
    expect(isObject(one)).toBe(false);

    const negative = -12;
    expect(isObject(negative)).toBe(false);

    const big = 9999999999999999n;
    expect(isObject(big)).toBe(false);

    const small = -9999999999999999n;
    expect(isObject(small)).toBe(false);
  });

  it('should return false if an array is provided', () => {
    const array = [];
    expect(isObject(array)).toBe(false);

    const arrayWithUndefined = [undefined];
    expect(isObject(arrayWithUndefined)).toBe(false);

    const arrayWithObject = [{}];
    expect(isObject(arrayWithObject)).toBe(false);

    const arrayFull = [1];
    expect(isObject(arrayFull)).toBe(false);
  });

  it('should return false if a function is provided', () => {
    const func = () => {};
    expect(isObject(func)).toBe(false);

    const funcWithReturn = () => 'foo';
    expect(isObject(funcWithReturn)).toBe(false);
  });
});
