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

export type UserType = {
  email: string;
  id: string;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
  telefone: string;
} | null;

export type ClienteType = {
  email: string;
  id: number;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
};

export type RevendedorType = {
  email: string;
  id: number;
  label: string;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
};

export type EditRevendedorType = {
  email?: string;
  id: number;
  label?: string;
  nome?: string;
  status?: 'ATIVO' | 'INATIVO';
};

export type EditClienteType = {
  email?: string;
  id: number;
  nome?: string;
  status?: 'ATIVO' | 'INATIVO';
};

export type ErrorType = {
  message: string;
  id: number;
  context: string;
  severity: string;
  title: string;
};
