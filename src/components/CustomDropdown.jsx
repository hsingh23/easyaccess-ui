// File: src/components/CustomDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Loader } from 'lucide-react';

const CustomDropdown = ({ options = [], value = [], onChange, placeholder = '', isMulti = false, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (isMulti) {
      const newValue = value.some(v => v.id === option.id)
        ? value.filter(v => v.id !== option.id)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleRemove = (e, optionToRemove) => {
    e.stopPropagation();
    const newValue = value.filter(v => v.id !== optionToRemove.id);
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border rounded p-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {isMulti ? (
            value.length > 0 ? (
              value.map(v => (
                <span key={v.id} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded flex items-center">
                  {v.name}
                  <button onClick={(e) => handleRemove(e, v)} className="ml-1">
                    <X size={12} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )
          ) : (
            value ? <span>{value.name}</span> : <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={20} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border-b"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <Loader className="animate-spin" />
            </div>
          ) : (
            filteredOptions.map(option => (
              <div
                key={option.id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  isMulti && value.some(v => v.id === option.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="font-semibold">{option.name}</div>
                {option.description && (
                  <div className="text-sm text-gray-600">{option.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;