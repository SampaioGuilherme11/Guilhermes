import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../Modal/Modal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Função para deletar produto
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/produtos/${productId}`);
      fetchProducts(); // Atualiza a lista de produtos após a deleção
    } catch (error) {
      console.error('Erro ao deletar o produto:', error);
    }
  };

  // Funções para manipulação do modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id); // Usando 'id' baseado na estrutura fornecida
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='container'>
      <h2>Produtos</h2>
      <Link to="/products/add">
        <button className='cadastrar-btn'>Cadastrar</button>
      </Link>
      <table className='tabela'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Venda</th>
            <th>Custo</th>
            <th>Lucro</th>
            <th>Quant</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              const cost = product.valorCusto; // Preço de custo
              const profit = product.valorVenda - cost; // Lucro

              return (
                <tr key={product.id}>
                  <td>{product.nome}</td>
                  <td>R$ {product.valorVenda ? product.valorVenda.toFixed(2) : '0.00'}</td>
                  <td>R$ {cost.toFixed(2)}</td>
                  <td>R$ {profit.toFixed(2)}</td>
                  <td>{product.estoque}</td>
                  <td>
                    <button className='deletar-btn' onClick={() => handleDeleteClick(product)}><i className="fa-solid fa-trash"></i></button>
                    <Link to={`/products/edit/${product.id}`}>
                      <button className='editar-btn'><i className="fa-solid fa-pen"></i></button>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">Nenhum produto cadastrado</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <Modal
          message={`Deseja excluir o produto ${productToDelete ? productToDelete.nome : ''}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ProductList;
