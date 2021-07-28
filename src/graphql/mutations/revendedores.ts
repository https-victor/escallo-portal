import graphql from 'graphql-tag';
export const REVENDEDOR_EDIT = graphql`
  mutation AtualizarRevendedor($revendedor: AtualizarRevendedorDTO!) {
    atualizarRevendedor(revendedor: $revendedor) {
      id
      status
      nome
      label
    }
  }
`;

export const REVENDEDOR_CREATE = graphql`
  mutation CriarRevendedor($revendedor: CriarRevendedorDTO!) {
    criarRevendedor(revendedor: $revendedor) {
      id
      status
      nome
      label
      token
    }
  }
`;

export const REVENDEDOR_SALVAR_EMAIL = graphql`
  mutation SalvarEmailRevendedor($email: EmailRevendedorDTO!) {
    salvarEmailRevendedor(email: $email) {
      id
      nome
      label
      status
    }
  }
`;
