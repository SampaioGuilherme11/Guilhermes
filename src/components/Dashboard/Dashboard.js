import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CaixaMensal from '../Grafics/CaixaMensal'; // Importa o componente do gráfico

const Dashboard = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/produtos');
      const products = response.data;

      // Calcular a quantidade total em estoque
      const stock = products.reduce((acc, product) => acc + product.estoque, 0);
      setTotalStock(stock);

      // Calcular o custo total, valor de venda total e lucro total
      const cost = products.reduce((acc, product) => acc + (product.valorCusto * product.estoque), 0);
      const salesValue = products.reduce((acc, product) => acc + (product.valorVenda * product.estoque), 0);
      const profit = salesValue - cost;

      setTotalCost(cost);
      setTotalSalesValue(salesValue);
      setTotalProfit(profit);
    } catch (error) {
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Função para formatar valores como reais
  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="dashboard">
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="cards">
          <StatCard title="Estoque Produtos" value={totalStock} />
          <StatCard title="Custo do Estoque" value={formatCurrency(totalCost)} />
          <StatCard title="Preço de Venda" value={formatCurrency(totalSalesValue)} />
          <StatCard title="Lucro Total" value={formatCurrency(totalProfit)} />
        </div>
      )}
      <CaixaMensal />
    </div>
  );
};

// Componente de Card
const StatCard = ({ title, value = 'N/A' }) => (
  <div className="card">
    <h2>{title}</h2>
    <p>{value}</p>
  </div>
);

export default Dashboard;