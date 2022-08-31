declare type F<T> = new () => T;
declare function inject<T>(Service: F<T>): T;
export default inject;
