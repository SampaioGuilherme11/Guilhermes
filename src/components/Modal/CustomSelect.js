import React, { useState, useEffect, useRef, useCallback } from 'react';

const CustomSelect = ({ options, value, onChange, isActive, onSelectClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
      onSelectClick(false); // Fecha o seletor
    }
  }, [onSelectClick]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]); // Adicione handleClickOutside aqui

  return (
    <div className={`custom-select ${isActive ? 'active' : 'Selecione'}`} ref={selectRef} onClick={() => {
      setIsOpen(!isOpen);
      onSelectClick(!isOpen);
    }}>
      <div className="selected">{options.find(option => option.value === value)?.label}</div>
      {isOpen && (
        <div className="options">
          {options.map((option, index) => (
            <div key={index} onClick={() => handleSelect(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
