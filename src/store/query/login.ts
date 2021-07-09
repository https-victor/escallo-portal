import graphql from 'graphql-tag';
export const CHECK_EMAIL = graphql`
  query verificarSeUsuarioExiste($email: String!) {
    verificarSeUsuarioExiste(email: $email)
  }
`;
export const CHECK_TOKEN = graphql`
  query {
    meusDados {
      nome
      email
      telefone
      id
      status
    }
  }
`;
