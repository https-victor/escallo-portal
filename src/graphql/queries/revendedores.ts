import graphql from 'graphql-tag';
export const REVENDEDOR_LIST_STATUS = graphql`
  query Revendedores($status: String!) {
    revendedores(status: $status) {
      id
      status
      nome
      label
    }
  }
`;

export const REVENDEDOR_LIST = graphql`
  query Revendedores {
    revendedores {
      id
      status
      nome
      label
    }
  }
`;
