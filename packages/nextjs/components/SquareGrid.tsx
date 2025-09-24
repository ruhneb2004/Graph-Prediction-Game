import React from "react";

interface SquareGridProps {
  squares: boolean[];
  onSquareClick: (index: number) => void;
  cols: number;
  squareSize: number; // 1. Accept the new size prop
}

const SquareGrid: React.FC<SquareGridProps> = ({ squares, onSquareClick, cols, squareSize }) => {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {squares.map((isFilled, index) => (
        <div
          key={index}
          // 2. Remove 'aspect-square' and apply width/height from the prop
          className={`border cursor-pointer transition-colors ${isFilled ? "bg-blue-500" : "bg-gray-200"}`}
          style={{ width: `${squareSize}px`, height: `${squareSize}px` }}
          onClick={() => onSquareClick(index)}
        ></div>
      ))}
    </div>
  );
};

export default SquareGrid;
