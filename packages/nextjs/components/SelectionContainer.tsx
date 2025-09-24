"use client";

import React, { useEffect, useRef, useState } from "react";
import SquareGrid from "~~/components/SquareGrid";
import { EtherInput } from "~~/components/scaffold-eth/Input/EtherInput";

interface Level {
  cols: number;
  rows: number;
}

const levels: Level[] = [
  { cols: 6, rows: 3 },
  { cols: 8, rows: 4 },
  { cols: 10, rows: 5 },
  { cols: 12, rows: 6 },
];

const SelectionContainer: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [squares, setSquares] = useState<boolean[]>([]);
  const [cols, setCols] = useState(0);
  const [squareSize, setSquareSize] = useState(0); // 1. State for the calculated size
  const [ethValue, setEthValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLevelData = levels[currentLevel];

  useEffect(() => {
    const calculateGrid = () => {
      if (containerRef.current) {
        // Use padding-box for more accurate dimensions
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const { cols: numCols, rows: numRows } = currentLevelData;
        const gap = 4; // Tailwind's gap-1 is 4px

        if (containerWidth > 0 && numCols > 0 && numRows > 0) {
          // 2. Calculate max size based on both width and height
          const maxSizeByWidth = (containerWidth - (numCols - 1) * gap) / numCols;
          const maxSizeByHeight = (containerHeight - (numRows - 1) * gap) / numRows;

          // Use the smaller of the two to ensure it fits in both dimensions
          const finalSize = Math.floor(Math.min(maxSizeByWidth, maxSizeByHeight));

          setSquareSize(finalSize);
          setCols(numCols);
          setSquares(Array(numCols * numRows).fill(false));
        }
      }
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [currentLevelData]); // Dependency array simplified

  const handleSquareClick = (index: number) => {
    const newSquares = [...squares];
    newSquares[index] = !newSquares[index];
    setSquares(newSquares);
  };

  const handleGetSelectedSquares = () => {
    const selectedSquares = squares.map((isSelected, index) => (isSelected ? index : -1)).filter(index => index !== -1);
    console.log("Selected squares:", selectedSquares);
    alert(`Selected squares: ${selectedSquares.join(", ")}`);
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 bg-gray-100 font-sans">
      {/* 3. Added flex utilities to center the grid perfectly */}
      <div
        ref={containerRef}
        className="w-full flex-grow border border-gray-300 rounded-lg bg-white shadow-inner flex justify-center items-center p-2"
      >
        {squareSize > 0 && (
          // 4. Pass the calculated size as a prop
          <SquareGrid squares={squares} onSquareClick={handleSquareClick} cols={cols} squareSize={squareSize} />
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <label htmlFor="levelSlider" className="mr-4 text-gray-700 whitespace-nowrap">
            Level: {currentLevel + 1}
          </label>
          <input
            id="levelSlider"
            type="range"
            min="0"
            max={levels.length - 1}
            value={currentLevel}
            onChange={e => setCurrentLevel(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <EtherInput value={ethValue} onChange={setEthValue} />
        <button
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
          onClick={handleGetSelectedSquares}
        >
          Get Selected Pixels
        </button>
      </div>
    </div>
  );
};

export default SelectionContainer;
