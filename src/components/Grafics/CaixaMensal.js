import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const CaixaMensal = () => {
  const [data, setData] = useState([]);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/caixa?ano=${currentYear}`);
        const entries = response.data;

        const monthlyData = {};

        entries.forEach(entry => {
          const date = new Date(entry.createdAt); // Use 'createdAt' para pegar a data correta
          const month = date.getMonth();
          const year = date.getFullYear();

          if (year !== currentYear) return;

          const key = `${year}-${month + 1}`;

          if (!monthlyData[key]) {
            monthlyData[key] = { month: date.toLocaleString('pt-BR', { month: 'short' }), entrada: 0, saida: 0 };
          }

          if (entry.tipo === 'entrada') {
            monthlyData[key].entrada += entry.valor;
          } else if (entry.tipo === 'saida') {
            monthlyData[key].saida += entry.valor;
          }
        });

        const allMonths = [
          'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
          'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
        ];

        const completeData = allMonths.map((month, index) => {
          const monthKey = `${currentYear}-${index + 1}`;
          const monthData = monthlyData[monthKey] || { month: month, entrada: 0, saida: 0 };
          return monthData;
        });

        setData(completeData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [currentYear]);

  // Componente Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#000', // Cor de fundo do card
          border: '1px solid #ccc', // Borda do card
          borderRadius: '5px', // Bordas arredondadas
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Sombra
        }}>
          <h4>{`Mês: ${label}`}</h4>
          <p style={{ color: '#82ca9d' }}>{`Entrada: R$ ${payload[0].value.toFixed(2)}`}</p>
          <p style={{ color: '#ff7300' }}>{`Saída: R$ ${payload[1].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'right',
      flexDirection: 'column',
      margin: '0 auto',
      width: '100%'
    }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Movimentações do Caixa</h2>
      <div className='grafico__barras' style={{
        width: '100%',
        maxWidth: '800px',
        height: '600px',
        margin: '0 auto',
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="month" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} /> {/* Usando o Tooltip personalizado */}
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="entrada" fill="#82ca9d" barSize={20} />
            <Bar dataKey="saida" fill="#ff7300" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CaixaMensal;
