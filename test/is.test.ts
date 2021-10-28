import { isInspectContentType } from '../src/proxy/utils/is';

describe('is.ts', () => {
  it('isInspectContentType', () => {
    expect(isInspectContentType({})).toBeFalsy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'content-type': 'application/json'})).toBeTruthy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'content-type': 'x-www-form-urlencoded'})).toBeTruthy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'content-type': 'application/x-javascript'})).toBeTruthy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'content-type': 'text/html'})).toBeTruthy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'content-type': 'text/html'})).toBeTruthy();
  });
  it('isInspectContentType', () => {
    expect(isInspectContentType({'accept': 'text/html'})).toBeTruthy();
  });
});
