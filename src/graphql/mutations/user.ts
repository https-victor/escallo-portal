import graphql from 'graphql-tag';
export const USER_AUTH = graphql`
  mutation autenticarUsuario($email: String!, $senha: String!) {
    autenticarUsuario(email: $email, senha: $senha) {
      id
      nome
      chaveExterna
      status
      telefone
      email
      permissoes {
        permissao
        cliente {
          id
          nome
          host
          status
        }
        revendedor {
          id
          nome
          label
          token
          status
        }
      }
    }
  }
`;

export const USER_ADD = graphql`
  mutation registrarUsuario($usuario: CriarUsuarioDTO!) {
    registrarUsuario(usuario: $usuario) {
      id
      nome
      chaveExterna
      status
      telefone
      email
    }
  }
`;
