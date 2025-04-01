import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  defaultValue?: string;
  onChange: (value: string) => void;
  width?: number;
  backgroundColor?: string;
  dropdownBackgroundColor?: string;
  dropdownHoverColor?: string;
  style?: React.CSSProperties;
}

const Select: React.FC<CustomDropdownProps> = ({
  options,
  defaultValue = '',
  onChange,
  width = 100,
  backgroundColor = '#1E1E1E',
  dropdownBackgroundColor = 'black',
  dropdownHoverColor = '#65E06F',
  style = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange(value);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        width,
        ...style,
      }}
    >
      {/* Dropdown Header */}
      <div
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '34px', 
          backgroundColor: '1E1E1E',
          color: 'white',
          border: '1.75px solid #646464',
          borderRadius: '10px',
          padding: '0 8px',
          cursor: 'pointer',
          fontFamily: 'inter',
        }}
      >
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {selectedValue || 'Select an option'}
        </div>
        <div
          style={{
            borderLeft: '2px solid #646464',
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            paddingLeft: '7px', 
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 1.34375L5 5.65625L0.5 1.34375"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: dropdownBackgroundColor,
            border: '1px solid #646464',
            borderRadius: '10px',
            marginTop: '4px',
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                color: 'white',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = dropdownHoverColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = dropdownBackgroundColor)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
