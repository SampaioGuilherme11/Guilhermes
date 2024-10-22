import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import MovementList from './components/Movement/MovementList';
import MovementForm from './components/Movement/MovementForm';
import CaixaList from './components/Caixa/CaixaList';
import CaixaForm from './components/Caixa/CaixaForm';
import PDVForm from './components/PDV/PDVForm';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Função para alternar o menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Efeito para adicionar a classe sticky no scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Limpeza do evento ao desmontar o componente
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div>
        <header className={isSticky ? 'sticky' : ''}>
          <div className='nav-bar'>
            <p className='logo'>Guilherme's</p>
            <div className={`navigation ${isMenuOpen ? 'active' : ''}`}>
              <div className='nav-items'>
                <div className='nav-close-btn' onClick={toggleMenu}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <Link to="/" onClick={toggleMenu}>Dashboard</Link>
                <Link to="/products" onClick={toggleMenu}>Produtos</Link>
                <Link to="/movements" onClick={toggleMenu}>Movimentações</Link>
                <Link to="/caixa" onClick={toggleMenu}>Caixa</Link>
                <Link to="/pdv" onClick={toggleMenu}>PDV</Link>
              </div>
            </div>
            <div className='nav-menu-btn' onClick={toggleMenu}>
              <i className="fa-solid fa-bars"></i>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/movements" element={<MovementList />} />
          <Route path="/movements/add" element={<MovementForm />} />
          <Route path="/movements/edit/:id" element={<MovementForm />} />
          <Route path="/caixa" element={<CaixaList />} />
          <Route path="/caixa/add" element={<CaixaForm />} />
          <Route path="/caixa/edit/:id" element={<CaixaForm />} />
          <Route path="/pdv" element={<PDVForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
