import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { Investimento } from '../types/investimento';
import { investimentoService } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ListagemInvestimentos() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const navigate = useNavigate();

  const carregarInvestimentos = async () => {
    try {
      const data = await investimentoService.listar();
      console.log('Dados recebidos da API:', data);
      setInvestimentos(data);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
      toast.error('Erro ao carregar investimentos');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este investimento?')) {
      try {
        await investimentoService.deletar(id);
        toast.success('Investimento excluído com sucesso');
        carregarInvestimentos();
      } catch (error) {
        toast.error('Erro ao excluir investimento');
      }
    }
  };

  const dadosGrafico = {
    labels: ['Ação', 'Fundo', 'Título'],
    datasets: [
      {
        data: [
          investimentos.filter((i) => i.tipo === 'Ação').length,
          investimentos.filter((i) => i.tipo === 'Fundo').length,
          investimentos.filter((i) => i.tipo === 'Título').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  useEffect(() => {
    carregarInvestimentos();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investimentos</h1>
        <button
          onClick={() => navigate('/cadastro')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Investimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lista de Investimentos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investimentos.map((investimento) => (
                  <tr key={investimento.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{investimento.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{investimento.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {investimento.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(investimento.data).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/editar/${investimento.id}`)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(investimento.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Distribuição por Tipo</h2>
          <div className="h-64">
            <Pie data={dadosGrafico} />
          </div>
        </div>
      </div>
    </div>
  );
} 