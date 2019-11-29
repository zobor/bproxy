import { expect } from 'chai';
import 'mocha';
import { rulesPattern } from '../src/rule';
import { IRule } from '../types/rule';

describe('rule.regx为String: https://tmall.com', () => {
  const rule: IRule = {
    regx: 'https://tmall.com',
  };
  const url1 = 'https://tmall.com/a.html';
  const url2 = 'https://www.tmall.com/a.html';
  it(`${url1} should matched`, () => {
    expect(rulesPattern([rule], url1).matched).to.be.true;
  });
  it(`${url2} should not mathded`, () => {
    expect(rulesPattern([rule], url2).matched).to.be.false;
  });
});

describe('rule.regx为String: https://g.alicdn.com/fusion-platform/sketch-markup/app.js', () => {
  const rule: IRule = {
    regx: 'https://g.alicdn.com/fusion-platform/sketch-markup/app.js',
  };
  const url = 'https://g.alicdn.com/fusion-platform/sketch-markup/app.js';
  it(`${url} should matched`, () => {
    expect(rulesPattern([rule], url).matched).to.be.true;
  });
});

describe('rule.regx为String: https://g.alicdn.com/fusion-platform/sketch-markup/*', () => {
  const rule: IRule = {
    regx: 'https://g.alicdn.com/fusion-platform/sketch-markup/*',
  };
  const url1 = 'https://g.alicdn.com/fusion-platform/sketch-markup/app.js';
  it(`${url1} should matched`, () => {
    expect(rulesPattern([rule], url1).matched).to.be.true;
  });
  const url2 = 'https://g.alicdn.com/fusion-platform/sketch-markup/files/app.js';
  it(`${url2} should not matched`, () => {
    expect(rulesPattern([rule], url2).matched).to.be.false;
  });
});


describe('rule.regx为RegExp: /\.tmall\.com/', () => {
  const rule: IRule = {
    regx: /\.tmall\.com/,
  };
  const url1 = 'https://tmall.com';
  const url2 = 'https://www.tmall.com';
  it(`${url1} should not matched`, () => {
    expect(rulesPattern([rule], url1).matched).to.be.false;
  });
  it(`${url2} should mathded`, () => {
    expect(rulesPattern([rule], url2).matched).to.be.true;
  });
});

describe('rule.regx为Function', () => {
  const rule: IRule = {
    regx: (url: string) => /\.tmall\.com/.test(url),
  };
  const url1 = 'https://tmall.com';
  const url2 = 'https://www.tmall.com';
  it(`${url1} should not matched`, () => {
    expect(rulesPattern([rule], url1).matched).to.be.false;
  });
  it(`${url2} should mathded`, () => {
    expect(rulesPattern([rule], url2).matched).to.be.true;
  });
});