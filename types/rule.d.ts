export interface IRule {
  regx: RegExp | string | Function;
  host?: string;
  filepath?: string;
  file?: string;
  path?: string;
}