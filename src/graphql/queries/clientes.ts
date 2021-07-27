import graphql from 'graphql-tag';
export const CLIENTE_LIST_STATUS = graphql`
  query Clientes($status: String!) {
    clientes(status: $status) {
      id
      status
      nome
    }
  }
`;

export const CLIENTE_LIST = graphql`
  query Clientes {
    clientes {
      id
      status
      nome
    }
  }
`;
