import graphql from 'graphql-tag';
export const USER_AUTH = graphql`
  mutation autenticarUsuarioo($email: String!, $senha: String!) {
    autenticarUsuario(email: $email, senha: $senha) {
      nome
      status
    }
  }
`;
