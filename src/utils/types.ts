export type DynObj = { [k: string]: any };
export type Subtract<T, T1> = Pick<T, Exclude<keyof T, keyof T1>>;

export type RequestParams = {
  path: string;
  method: string;
  headers?: any;
  body?: any;
  host?: any;
  replaceHeaders?: boolean;
};

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type ErrorType = {
  message: string;
  id: number;
  context: string;
  severity: string;
  title: string;
};
