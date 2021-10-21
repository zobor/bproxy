import { Rule } from '../types/rule';

export default interface Pattern {
  delay?: number;
  matched?: boolean;
  filepath?: string;
  matchedRule?: Rule;
  disableHttpRequest?: boolean;
  responseHeaders?: {
    [key: string]: any;
  };
}
