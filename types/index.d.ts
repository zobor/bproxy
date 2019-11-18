export interface StringTMap<T> { [key: string]: T; };
export interface NumberTMap<T> { [key: number]: T; };

export interface StringAnyMap extends StringTMap<any> {};
export interface NumberAnyMap extends NumberTMap<any> {};

export interface StringStringMap extends StringTMap<string> {};
export interface NumberStringMap extends NumberTMap<string> {};

export interface StringNumberMap extends StringTMap<number> {};
export interface NumberNumberMap extends NumberTMap<number> {};

export interface StringBooleanMap extends StringTMap<boolean> {};
export interface NumberBooleanMap extends NumberTMap<boolean> {};