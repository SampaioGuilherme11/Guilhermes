import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSelect from '../Modal/CustomSelect';

function CaixaForm() {
  const [caixa, setCaixa] = useState({
    valor: '',
    formaPagamentoId: null,
    observacao: '',
    data: new Date().toISOString().slice(0, 10),
    tipo: 'entrada',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSelect, setActiveSelect] = useState(null);
  const [formasPagamento, setFormasPagamento] = useState([]);

  useEffect(() => {
    const fetchCaixaData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/caixa/${id}`);
          const caixaData = response.data;

          // Use createdAt como data
          if (caixaData.createdAt) {
            caixaData.data = new Date(caixaData.createdAt).toISOString().slice(0, 10);
          } else {
            console.error('Data inválida recebida:', caixaData.createdAt);
          }

          setCaixa(caixaData);
        } catch (error) {
          console.error('Erro ao buscar a entrada de caixa:', error);
          alert('Erro ao buscar a entrada de caixa. Tente novamente.');
        }
      }
    };
    fetchCaixaData();
  }, [id]);

  const fetchFormasPagamento = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/formasPagamento');
      setFormasPagamento(response.data);
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
      alert('Erro ao buscar formas de pagamento. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchFormasPagamento();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const caixaData = {
        ...caixa,
        data: new Date(caixa.data).toISOString(),
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/caixa/${id}`, caixaData);
      } else {
        await axios.post('http://localhost:5000/api/caixa', caixaData);
      }
      navigate('/caixa');
    } catch (error) {
      console.error('Erro ao salvar a entrada de caixa:', error);
      alert('Erro ao salvar a entrada de caixa. Tente novamente.');
    }
  };

  return (
    <div className='container'>
      <h2 className='titulo-container'>{id ? 'Editar Caixa' : 'Movimentação Caixa'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Valor */}
        <label className='label-form'>Valor</label>
        <input
          type="number"
          className='form-input'
          value={caixa.valor}
          onChange={(e) => setCaixa({ ...caixa, valor: e.target.value })}
          required
        />

        {/* Forma de Pagamento */}
        <label className='label-form'>Forma de Pagamento</label>
        <CustomSelect
          options={formasPagamento.map(forma => ({
            value: forma.id,
            label: forma.descricao,
          }))}
          value={caixa.formaPagamentoId}
          onChange={(option) => setCaixa({ ...caixa, formaPagamentoId: option.value })}
          isActive={activeSelect === 'formaPagamento'}
          onSelectClick={(isOpen) => setActiveSelect(isOpen ? 'formaPagamento' : null)}
        />

        {/* Tipo de Transação */}
        <label className='label-form'>Tipo de Transação</label>
        <CustomSelect
          options={[
            { value: 'entrada', label: 'Entrada' },
            { value: 'saida', label: 'Saída' },
          ]}
          value={caixa.tipo}
          onChange={(option) => setCaixa({ ...caixa, tipo: option.value })}
          isActive={activeSelect === 'tipo'}
          onSelectClick={(isOpen) => setActiveSelect(isOpen ? 'tipo' : null)}
        />

        {/* Observação */}
        <label className='label-form'>Observação</label>
        <textarea
          className='form-input'
          value={caixa.observacao}
          onChange={(e) => setCaixa({ ...caixa, observacao: e.target.value })}
        />

        {/* Data */}
        <label className='label-form'>Data</label>
        <input
          type="date"
          className='form-input'
          value={caixa.data}
          onChange={(e) => setCaixa({ ...caixa, data: e.target.value })}
          required
        />

        {/* Botões */}
        <div className='container-btn'>
          <button type="submit" className='container-cadastrar-btn'>
            {id ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            type="button"
            className='container-voltar-btn'
            onClick={() => navigate('/caixa')}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CaixaForm;
