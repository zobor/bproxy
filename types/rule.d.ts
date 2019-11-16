export default interface IRule {
  regx: RegExp | string | Function;
  host?: string;
  filepath?: string;
}