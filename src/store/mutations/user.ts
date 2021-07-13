import graphql from 'graphql-tag';
export const USER_AUTH = graphql`
  mutation autenticarUsuario($email: String!, $senha: String!) {
    autenticarUsuario(email: $email, senha: $senha) {
      id
      nome
      status
      telefone
      email
    }
  }
`;

export const USER_ADD = graphql`
  mutation registrarUsuario($usuario: CriarUsuarioDTO!) {
    registrarUsuario(usuario: $usuario) {
      id
      nome
      status
      telefone
      email
    }
  }
`;
