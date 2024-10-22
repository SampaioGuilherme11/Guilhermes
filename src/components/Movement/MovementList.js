import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal'; // Importe o componente Modal

const MovementList = () => {
  const [movements, setMovements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState(null); // Para armazenar a movimentação a ser deletada
  const [products, setProducts] = useState([]); // Para armazenar os produtos

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/movimentacoes');
        setMovements(response.data);
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchMovements();
    fetchProducts(); // Busca produtos quando o componente é montado
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/movimentacoes/${id}`);
      setMovements(movements.filter((movement) => movement.id !== id));
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
    }
  };

  const handleDeleteClick = (movement) => {
    setMovementToDelete(movement);
    setShowModal(true); // Exibe o modal de confirmação
  };

  const handleConfirmDelete = () => {
    if (movementToDelete) {
      handleDelete(movementToDelete.id); // Usando id da movimentação
      setShowModal(false); // Fecha o modal
      setMovementToDelete(null); // Reseta a movimentação a ser deletada
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Fecha o modal sem deletar
    setMovementToDelete(null); // Reseta a movimentação a ser deletada
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('pt-BR', { // Formato brasileiro
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } else {
      return 'Data inválida'; // Exibe mensagem se a data for inválida
    }
  };

  return (
    <div className='container'>
      <h2>Movimentações</h2>
      <Link to="/movements/add"><button className='cadastrar-btn'>Cadastrar</button></Link>
      <table className='tabela'>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {movements.length > 0 ? (
            movements.map((movement) => {
              // Encontra o produto correspondente pelo ID
              const product = products.find(p => p.id === movement.produtoId);
              const productName = product ? product.nome : 'Produto não encontrado'; // Verifica se o produto existe

              return (
                <tr key={movement.id}>
                  <td>{productName}</td>
                  <td>{formatDate(movement.createdAt)}</td>
                  <td>{movement.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                  <td>{movement.quantidade}</td>
                  <td>
                    <button className='deletar-btn' onClick={() => handleDeleteClick(movement)}><i className="fa-solid fa-trash"></i></button>
                    <Link to={`/movements/edit/${movement.id}`}>
                      <button className='editar-btn'><i className="fa-solid fa-pen"></i></button>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Nenhuma movimentação encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Exibir modal se showModal for true */}
      {showModal && (
        <Modal
          message={`Deseja excluir a movimentação de ${movementToDelete ? (products.find(p => p.id === movementToDelete.produtoId)?.nome || 'produto desconhecido') : ''}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default MovementList;
