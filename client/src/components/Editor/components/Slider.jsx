import React, { useState, useEffect, useRef } from "react";

const Slider = ({ value, onChange2, min = 0, max = 100, step = 1 }) => {
  const [localValue, setLocalValue] = useState(value || 0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value * max);
    }
  }, [value]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging && sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const newValue = Math.round((offsetX / rect.width) * (max - min) + min);
      const clampedValue = Math.max(min, Math.min(newValue, max));
      setLocalValue(clampedValue);
      onChange2(clampedValue / max);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setLocalValue(localValue);
      onChange2(localValue / max);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, localValue]);

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange2(newValue / max);
    }
  };

  return (
    <div
      style={{
        width: "275px",
        margin: "0 auto",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        color: "white",
        gap: "10px",
      }}
    >
      <div
        className="slider-container"
        ref={sliderRef}
        style={{
          position: "relative",
          height: "10px",
          margin: "0 10px",
          width: "250px",
          border: "1px solid #646464",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, #FFF 100%)",
            borderRadius: "5px",
          }}
        ></div>
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: "-5px",
            left: `${localValue}%`,
            transform: "translateX(-50%)",
            width: "20px",
            height: "20px",
            backgroundColor: "#151515",
            border: "2px solid #646464",
            borderRadius: "50%",
            cursor: "grab",
            transition: isDragging ? "none" : "left 0.1s ease-out",
          }}
        ></div>
      </div>
      <input
        type="number"
        min={min}
        max={max}
        value={localValue}
        onChange={handleInputChange}
        style={{
          width: "60px",
          padding: "5px",
          backgroundColor: "#121212",
          color: "white",
          border: "1px solid #444",
          borderRadius: "4px",
          textAlign: "center",
        }}
        aria-label="Slider Value"
      />
    </div>
  );
};

export default Slider;
