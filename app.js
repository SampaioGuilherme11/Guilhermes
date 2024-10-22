// app.js

const express = require('express');
const cors = require('cors'); // Importa o pacote CORS
const app = express();
const bodyParser = require('body-parser');
const produtoRoutes = require('./routes/produtoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');
const caixaRoutes = require('./routes/caixaRoutes');
const formaPagamentoRoutes = require('./routes/formaPagamentoRoutes');
const produtosPdvRoutes = require('./routes/produtosPdvRoutes');
const pdvRoutes = require('./routes/pdvRoutes');

// Configurações do app
app.use(cors()); // Adiciona o middleware CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/produtos', produtoRoutes);
app.use('/api/movimentacoes', movimentacaoRoutes);
app.use('/api/caixa', caixaRoutes);
app.use('/api/formasPagamento', formaPagamentoRoutes);
app.use('/api/produtosPdv', produtosPdvRoutes);
app.use('/api/pdv', pdvRoutes);

// Inicializa o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
