import React, { useState, useEffect } from "react";

const Counter = ({ defValue, val, onChange }) => {
  const [value, setValue] = useState(0);
  const [internalValue, setInternalValue] = useState(val || 0);

  useEffect(() => {
    setInternalValue(val);
  }, [val]);

  const handleIncrement = () => {
    const newValue = internalValue + 1;
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = internalValue - 1;
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "" || Number(newValue)) {
      setInternalValue(newValue);
      if (newValue !== "") {
        onChange(newValue);
      }
    }
  };

  return (
    <div
      style={{
        width: "40%",
        font: "DM Sans",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "120px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          value={internalValue}
          onChange={handleInputChange}
          style={{
            width: "80%",
            padding: "5px",
            backgroundColor: "#1E1E1E",
            color: "white",
            border: "1.75px solid #646464",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "16px",
            fontFamily: "Inter",
          }}
        />

        <svg
          onClick={handleDecrement}
          style={{
            position: "absolute",
            right: "28px",
            top: "17px",
            cursor: "pointer",
          }}
          width="13"
          height="13"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Controls">
            <path
              id="chevron-up"
              d="M14.0625 7.4375L9 12.5L3.9375 7.4375"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <svg
          onClick={handleIncrement}
          style={{
            position: "absolute",
            right: "28px",
            top: "6px",
            cursor: "pointer",
          }}
          transform="rotate(180)"
          width="13"
          height="13"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Controls">
            <path
              id="chevron-up"
              d="M14.0625 7.4375L9 12.5L3.9375 7.4375"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
      <style>
        {`
            input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input {
              border-color: #646464 !important;
            }
            input:focus {
              outline: none;
              border-color: #646464 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Counter;
