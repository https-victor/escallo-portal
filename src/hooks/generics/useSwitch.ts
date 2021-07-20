import { useState } from 'react';

export type SwitchReturnType = {
  state: boolean;
  onSwitch: (newState?: boolean | undefined) => void;
};

/**
 * Hook básico de controle de estado booleano com switch.
 * @param {boolean} initialState - Modo inicial do Switch, padrão configurado como booleano falso.
 * @returns {SwitchReturnType} - Retorna o modo atual da dialog e a função para atualizar o modo no estado.
 *
 * @example O hook useSwitch retorna dois valores: o estado atual da Switch e uma função para trocar o estado.
 *    const switch = useSwitch(false)
 *    switch.state
 *    switch.onSwitch(true)
 */
export const useSwitch = (initialState = false): SwitchReturnType => {
  const [state, setState] = useState<boolean>(initialState);

  /**
   * Função que realiza a troca do estado do switch.
   * @param newState - Parâmetro configurado como undefined, caso a função receba algum valor booleano como parâmetro, este valor será definido como novo estado.
   *  Se não passado nenhum valor, o novo estado será o contrário do estado atual.
   *
   * @example
   * onSwitch() ou onSwitch(false)
   */
  const onSwitch = (newState: boolean | undefined = undefined): void => {
    setState((prevState: boolean) => (newState !== undefined ? newState : !prevState));
  };

  return {
    state,
    onSwitch
  };
};
