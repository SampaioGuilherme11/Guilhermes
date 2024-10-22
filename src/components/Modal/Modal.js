// src/components/Modal.js

import React from 'react';

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='overlay'>
      <div className='modal'>
        <h3>{message}</h3>
        <div className='option-delete'>
          <button className='confirme' onClick={onConfirm}>Sim</button>
          <button className='cancele' onClick={onCancel}>Não</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
