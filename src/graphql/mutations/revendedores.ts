import graphql from 'graphql-tag';
export const REVENDEDOR_EDIT = graphql`
  mutation AtualizarRevendedor($revendedor: AtualizarRevendedorDTO!) {
    atualizarRevendedor(revendedor: $revendedor) {
      id
      status
      nome
      label
      email
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
      email
    }
  }
`;
