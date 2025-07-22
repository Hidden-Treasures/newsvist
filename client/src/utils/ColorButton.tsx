import React, { FC } from "react";

interface ColorButtonProps {
  onClick: () => void;
  isActive: boolean;
  color: string;
  testId: string;
  borderColor?: string;
}

const ColorButton: FC<ColorButtonProps> = ({
  onClick,
  isActive,
  color,
  testId,
  borderColor,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-6 h-6 rounded-full border-2 ${
        isActive ? "border-gray-800" : `border-transparent`
      }`}
      style={{
        backgroundColor: color,
        borderColor:
          borderColor || (isActive ? "border-gray-800" : "transparent"),
      }}
      data-testid={testId}
      title={color}
    />
  );
};

export default ColorButton;
