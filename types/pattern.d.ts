import { IRule } from '../types/rule';

export default interface IPattern {
  delay: number;
  matched: boolean;
  filepath?: string;
  matchedRule?: IRule;
  disableHttpRequest?: boolean;
  responseHeaders?: Object;
}