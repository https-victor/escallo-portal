import graphql from 'graphql-tag';

export const USER_LIST = graphql`
  query Usuarios {
    usuarios {
      id
      nome
      email
      telefone
      status
    }
  }
`;

export const USER_LIST_STATUS = graphql`
  query Usuarios($status: String!) {
    usuarios(status: $status) {
      id
      nome
      email
      telefone
      status
    }
  }
`;
