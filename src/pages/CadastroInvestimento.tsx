import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { investimentoSchema, type InvestimentoFormData } from '../schemas/investimentoSchema';
import { investimentoService } from '../services/api';
import type { Investimento } from '../types/investimento';

export default function CadastroInvestimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditando = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestimentoFormData>({
    resolver: zodResolver(investimentoSchema),
  });

  useEffect(() => {
    if (isEditando) {
      const carregarInvestimento = async () => {
        try {
          const investimentos = await investimentoService.listar();
          const investimento = investimentos.find((i: Investimento) => i.id === Number(id));
          if (investimento) {
            reset({
              nome: investimento.nome,
              tipo: investimento.tipo,
              valor: investimento.valor,
              data: new Date(investimento.data).toISOString().split('T')[0],
            });
          }
        } catch (error) {
          toast.error('Erro ao carregar investimento');
          navigate('/');
        }
      };
      carregarInvestimento();
    }
  }, [id, isEditando, reset, navigate]);

  const onSubmit = async (data: InvestimentoFormData) => {
    try {
      console.log('Dados do formulário:', data);
      
      // Garantir que o nome não seja "string"
      if (data.nome === 'string') {
        toast.error('Por favor, insira um nome válido para o investimento');
        return;
      }

      if (isEditando) {
        await investimentoService.atualizar(Number(id), data);
        toast.success('Investimento atualizado com sucesso');
      } else {
        await investimentoService.criar(data);
        toast.success('Investimento criado com sucesso');
      }
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
      toast.error('Erro ao salvar investimento');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditando ? 'Editar Investimento' : 'Novo Investimento'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            {...register('nome')}
            placeholder="Digite o nome do investimento"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            {...register('tipo')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um tipo</option>
            <option value="Ação">Ação</option>
            <option value="Fundo">Fundo</option>
            <option value="Título">Título</option>
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Valor</label>
          <input
            type="number"
            step="0.01"
            {...register('valor', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.valor && (
            <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            {...register('data')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.data && (
            <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {isEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
} 