import { z } from 'zod';

export const investimentoSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .refine((nome) => nome !== 'string', {
      message: 'Por favor, insira um nome válido para o investimento',
    }),
  tipo: z.enum(['Ação', 'Fundo', 'Título'], {
    required_error: 'Tipo é obrigatório',
  }),
  valor: z.number().min(0.01, 'Valor deve ser maior que 0'),
  data: z.string().refine((data) => {
    const dataInvestimento = new Date(data);
    const hoje = new Date();
    return dataInvestimento <= hoje;
  }, 'Data não pode ser futura'),
});

export type InvestimentoFormData = z.infer<typeof investimentoSchema>; 