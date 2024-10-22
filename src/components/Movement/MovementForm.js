import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CustomSelect from '../Modal/CustomSelect';

function MovementForm() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [movement, setMovement] = useState({
    produtoId: '',
    quantidade: '',
    tipo: 'entrada',
  });
  const [productStock, setProductStock] = useState(0);
  const [activeSelect, setActiveSelect] = useState(null);
  const navigate = useNavigate();

  // Carregar a lista de produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  // Carregar movimentação, se estiver no modo de edição (com `id`)
  useEffect(() => {
    if (id && products.length > 0) {
      const fetchMovement = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/movimentacoes/${id}`);
          const movementData = response.data;

          setMovement({
            produtoId: movementData.produtoId,
            quantidade: movementData.quantidade,
            tipo: movementData.tipo,
          });

          // Atualiza o estoque do produto ao buscar a movimentação
          const selectedProduct = products.find(product => product.id === movementData.produtoId);
          setProductStock(selectedProduct ? selectedProduct.estoque : 0);
        } catch (error) {
          console.error('Erro ao buscar movimentação:', error);
        }
      };

      fetchMovement();
    }
  }, [id, products]);

  // Submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quantidadeMovimentada = Number(movement.quantidade);

      // Validações
      if (quantidadeMovimentada <= 0) {
        alert('A quantidade deve ser maior que zero.');
        return;
      }

      if (movement.tipo === 'saida' && quantidadeMovimentada > productStock) {
        alert('Quantidade insuficiente em estoque.');
        return;
      }

      // Envio dos dados da movimentação
      if (id) {
        await axios.put(`http://localhost:5000/api/movimentacoes/${id}`, movement);
      } else {
        await axios.post('http://localhost:5000/api/movimentacoes', movement);
      }

      navigate('/movements');
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
      alert('Erro ao salvar movimentação. Tente novamente.');
    }
  };

  const productName = movement.produtoId
    ? products.find(product => product.id === movement.produtoId)?.nome
    : 'Produto não encontrado';

  return (
    <div className='container'>
      <h2 className='titulo-container'>{id ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {id ? (
            <div>
              <label className='label-form'>Produto</label>
              <div className='form-input'>{productName || 'Produto não encontrado'}</div>
            </div>
          ) : (
            <>
              <label className='label-form'>Produto</label>
              <CustomSelect
                options={products.map(product => ({
                  value: product.id,
                  label: product.nome,
                }))}
                value={movement.produtoId}
                onChange={(option) => {
                  setMovement({ ...movement, produtoId: option.value });
                  const selectedProduct = products.find(product => product.id === option.value);
                  setProductStock(selectedProduct ? selectedProduct.estoque : 0);
                }}
                isActive={activeSelect === 'produto'}
                onSelectClick={(isOpen) => setActiveSelect(isOpen ? 'produto' : null)}
              />
            </>
          )}
        </div>

        <label className='label-form'>Quantidade</label>
        <div>
          <input
            type="number"
            className='form-input'
            value={movement.quantidade}
            onChange={(e) => setMovement({ ...movement, quantidade: e.target.value })}
            required
            min="1"
          />
        </div>

        <div className='label-form'>
          <label>Tipo</label>
          <CustomSelect
            options={[
              { value: 'entrada', label: 'Entrada' },
              { value: 'saida', label: 'Saída' },
            ]}
            value={movement.tipo}
            onChange={(option) => setMovement({ ...movement, tipo: option.value })}
            isActive={activeSelect === 'tipo'}
            onSelectClick={(isOpen) => setActiveSelect(isOpen ? 'tipo' : null)}
          />
        </div>

        <div className='container-btn'>
          <button type="submit" className='container-cadastrar-btn'>{id ? 'Atualizar' : 'Adicionar'}</button>
          <button type="button" className='container-voltar-btn' onClick={() => navigate('/movements')}>Voltar</button>
        </div>
      </form>
    </div>
  );
}

export default MovementForm;
