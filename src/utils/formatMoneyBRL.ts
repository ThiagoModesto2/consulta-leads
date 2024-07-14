/**
 * Converte um número em formato de moeda brasileira (BRL).
 *
 * @param valor - O número a ser convertido.
 * @returns A string formatada como moeda brasileira.
 */
export const formatMoneyBRL = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}