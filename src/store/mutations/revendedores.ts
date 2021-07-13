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
