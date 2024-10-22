import React, { useState, useEffect } from 'react';
import CustomSelect from '../Modal/CustomSelect'; // Certifique-se de que o caminho está correto

const PDVForm = () => {
  const [products, setProducts] = useState([]); // Lista de produtos disponíveis
  const [paymentMethods, setPaymentMethods] = useState([]); // Lista de formas de pagamento
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [selectedProduct, setSelectedProduct] = useState(null); // Produto selecionado
  const [quantity, setQuantity] = useState(1); // Quantidade do produto
  const [addedProducts, setAddedProducts] = useState([]); // Produtos adicionados à tabela
  const [totalValue, setTotalValue] = useState(0); // Total da venda
  const [paymentMethod, setPaymentMethod] = useState(''); // Método de pagamento
  const [showSuggestions, setShowSuggestions] = useState(false); // Estado para controlar a exibição das sugestões
  const [activeSelect, setActiveSelect] = useState(null); // Estado para controle do select

  // Busca produtos e formas de pagamento da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/produtos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/formasPagamento');
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error('Erro ao buscar formas de pagamento:', error);
      }
    };

    fetchProducts();
    fetchPaymentMethods();
  }, []);

  // Filtrando os produtos de acordo com o termo de busca
  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adiciona o produto selecionado à tabela
  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      const newProduct = {
        ...selectedProduct,
        quantity,
        totalPrice: (selectedProduct.valorVenda * quantity).toFixed(2),
      };
      setAddedProducts([...addedProducts, newProduct]);
      setTotalValue(prevTotal => (Number(prevTotal) + Number(newProduct.totalPrice)).toFixed(2));
      setQuantity(1);
      setSelectedProduct(null);
      setSearchTerm('');
      setShowSuggestions(false);
    } else {
      alert('Selecione um produto válido e defina uma quantidade.');
    }
  };

  const handleRemoveProduct = (index) => {
    const removedProduct = addedProducts[index];
    setTotalValue(prevTotal => (Number(prevTotal) - Number(removedProduct.totalPrice)).toFixed(2));
    const updatedProducts = addedProducts.filter((_, i) => i !== index);
    setAddedProducts(updatedProducts);
  };

  const handleSubmitSale = async () => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento!');
      return;
    }

    if (addedProducts.length === 0) {
      alert('Adicione pelo menos um produto antes de finalizar a venda.');
      return;
    }

    try {
      const saleData = {
        valor: totalValue,
        formaPagamentoId: paymentMethod,
        produtos: addedProducts.map(product => ({
          produtoId: product.id, // ID do produto
          quantidade: product.quantity,
          nomeProduto: product.nome, // Adicionando descrição do produto
          preco: product.valorVenda, // Preço do produto
        })),
      };

      const response = await fetch('http://localhost:5000/api/pdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        alert('Venda concluída com sucesso!');
        setAddedProducts([]);
        setTotalValue(0);
        setPaymentMethod('');
      } else {
        const error = await response.json();
        alert(`Erro ao registrar venda: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar a venda. Tente novamente.');
    }
  };

  return (
    <div className='container'>
      <h1 className='titulo-container'>PDV</h1>
      <div>
        <input
          type="text"
          placeholder="Nome do Produto"
          className='form-input'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
        />
        {showSuggestions && searchTerm && filteredProducts.length > 0 && (
          <ul className='lista-produto'>
            {filteredProducts.map(product => (
              <li className='lista-item' key={product.id} onClick={() => {
                setSelectedProduct(product);
                setSearchTerm(product.nome);
                setShowSuggestions(false);
              }}>
                {product.nome} - Estoque: {product.estoque}
              </li>
            ))}
          </ul>
        )}
        <div className='conteiner-info-products'>
          <input
            type="number"
            className='quantidade-produto'
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button className='adicionar-btn' onClick={handleAddProduct}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <button className='remover-btn' onClick={() => {
            setQuantity(1);
            setSearchTerm('');
            setSelectedProduct(null);
            setShowSuggestions(false);
          }}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <table className='tabela'>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quant</th>
            <th>Uni</th>
            <th>Líquido</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {addedProducts.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.nome}</td>
              <td>{product.quantity}</td>
              <td>R$ {product.valorVenda.toFixed(2)}</td>
              <td>R$ {product.totalPrice}</td>
              <td>
                <button className='deletar-btn' onClick={() => handleRemoveProduct(index)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className='pagamento-info'>VR TOTAL: R$ {totalValue}</h3>
      <div className='form-pagamento'>
        <label className='label-form'>Forma de Pagamento</label>
        <CustomSelect
          options={paymentMethods.map(method => ({
            value: method.id, // ID da forma de pagamento
            label: method.descricao, // Descrição da forma de pagamento
          }))}
          value={paymentMethod}
          onChange={(option) => setPaymentMethod(option.value)}
          isActive={activeSelect === 'payment'}
          onSelectClick={(isOpen) => setActiveSelect(isOpen ? 'payment' : null)}
        />
      </div>
      <button className='container-cadastrar-btn' onClick={handleSubmitSale}>FINALIZAR VENDA</button>
    </div>
  );
};

export default PDVForm;
