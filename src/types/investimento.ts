export type TipoInvestimento = 'Ação' | 'Fundo' | 'Título';

export interface Investimento {
  id?: number;
  nome: string;
  tipo: TipoInvestimento;
  valor: number;
  data: string;
}

export interface InvestimentoFormData extends Omit<Investimento, 'id'> {} 