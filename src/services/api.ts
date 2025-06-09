import axios from 'axios';
import type { Investimento } from '../types/investimento';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const investimentoService = {
  criar: async (investimento: Omit<Investimento, 'id'>) => {
    const response = await api.post('/criaInvestimentos', investimento);
    return response.data;
  },

  listar: async () => {
    const response = await api.get('/listaInvestimentos');
    return response.data;
  },

  atualizar: async (id: number, investimento: Omit<Investimento, 'id'>) => {
    const response = await api.put(`/atualizaInvestimentos/${id}`, investimento);
    return response.data;
  },

  deletar: async (id: number) => {
    const response = await api.delete(`/deletaInvestimentos/${id}`);
    return response.data;
  },
}; 