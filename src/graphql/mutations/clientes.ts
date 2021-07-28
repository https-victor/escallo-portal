import graphql from 'graphql-tag';
export const CLIENTE_EDIT = graphql`
  mutation AtualizarCliente($cliente: AtualizarClienteDTO!) {
    atualizarCliente(cliente: $cliente) {
      id
      status
      nome
    }
  }
`;

export const CLIENTE_CREATE = graphql`
  mutation CriarCliente($cliente: CriarClienteDTO!) {
    criarCliente(cliente: $cliente) {
      id
      status
      nome
    }
  }
`;

export const CLIENTE_SALVAR_EMAIL = graphql`
  mutation SalvarEmailCliente($email: EmailClienteDTO!) {
    salvarEmailCliente(email: $email) {
      id
      nome
      status
    }
  }
`;
