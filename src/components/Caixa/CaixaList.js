import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal'; // Importe o componente Modal

const CaixaList = () => {
  const [caixaList, setCaixaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [caixaToDelete, setCaixaToDelete] = useState(null);

  useEffect(() => {
    const fetchCaixa = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/caixa');
        setCaixaList(response.data);
      } catch (error) {
        console.error('Erro ao buscar entradas de caixa:', error);
        alert('Erro ao buscar entradas de caixa. Tente novamente.');
      }
    };

    fetchCaixa();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/caixa/${id}`);
      setCaixaList(caixaList.filter(entry => entry.id !== id)); // Atualiza a lista após deletar
    } catch (error) {
      console.error('Erro ao deletar entrada de caixa:', error);
      alert('Erro ao deletar entrada de caixa. Tente novamente.');
    }
  };

  const handleDeleteClick = (caixa) => {
    setCaixaToDelete(caixa);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (caixaToDelete) {
      handleDelete(caixaToDelete.id); // Usando o id da entrada de caixa
      setShowModal(false);
      setCaixaToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setCaixaToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className='container'>
      <h2>Caixa</h2>
      <Link to="/caixa/add"><button className='cadastrar-btn'>Cadastrar</button></Link>
      <table className='tabela'>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Forma de Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {caixaList.length > 0 ? (
            caixaList.map(entry => (
              <tr key={entry.id}>
                <td>{formatDate(entry.createdAt)}</td>
                <td>{entry.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                <td>{formatCurrency(entry.valor)}</td>
                <td>{entry.formaPagamento ? entry.formaPagamento.descricao : 'Não especificada'}</td>
                <td>
                  <button className='deletar-btn' onClick={() => handleDeleteClick(entry)}><i className="fa-solid fa-trash"></i></button>
                  <Link to={`/caixa/edit/${entry.id}`}>
                    <button className='editar-btn'><i className="fa-solid fa-pen"></i></button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhuma entrada ou saída de caixa encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <Modal
          message={`Deseja excluir a entrada de caixa de ${caixaToDelete ? (caixaToDelete.observacao || 'observação desconhecida') : ''}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CaixaList;
