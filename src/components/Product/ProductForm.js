import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
  const { id } = useParams(); // Pega o ID do produto da URL
  const [nome, setNome] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [valorCusto, setValorCusto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para mensagens de erro
  const navigate = useNavigate();

  // Função para buscar o produto se um ID for passado
  const fetchProduct = useCallback(async () => {
    if (!id) return; // Se não houver ID, não tenta buscar

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/produtos/${id}`);
      const product = response.data;
      if (product) {
        setNome(product.nome);
        setValorVenda(product.valorVenda.toString());
        setValorCusto(product.valorCusto.toString());
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      setError('Erro ao buscar produto. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Função para salvar ou atualizar o produto no backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpa mensagens de erro antes de uma nova operação

    if (!nome || !valorVenda || !valorCusto) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    const newProduct = {
      nome,
      valorVenda: parseFloat(valorVenda),
      valorCusto: parseFloat(valorCusto),
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/produtos/${id}`, newProduct);
      } else {
        await axios.post('http://localhost:5000/api/produtos', newProduct);
      }
      navigate('/products'); // Redireciona imediatamente após salvar
    } catch (error) {
      console.error('Erro ao salvar o produto:', error.response ? error.response.data : error.message);
      setError('Erro ao salvar o produto. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <h2 className='titulo-container'>{id ? 'Editar Produto' : 'Cadastro de Produto'}</h2>
      {error && <div className='error-message'>{error}</div>} {/* Mensagem de erro */}
      <form onSubmit={handleSubmit}>
        <label className='label-form'>Nome do Produto</label>
        <input
          className='form-input'
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={loading}
        />
        
        <label className='label-form'>Preço de Venda</label>
        <input
          className='form-input'
          type="number"
          step="0.01"
          value={valorVenda}
          onChange={(e) => setValorVenda(e.target.value)}
          required
          disabled={loading}
        />
        
        <label className='label-form'>Custo do Produto</label>
        <input
          className='form-input'
          type="number"
          step="0.01"
          value={valorCusto}
          onChange={(e) => setValorCusto(e.target.value)}
          required
          disabled={loading}
        />
        
        <div className='container-btn'>
          <button type="submit" className='container-cadastrar-btn' disabled={loading}>
            {loading ? 'Salvando...' : id ? 'Atualizar' : 'Cadastrar'}
          </button>
          <button type="button" className='container-voltar-btn' onClick={() => navigate('/products')} disabled={loading}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
