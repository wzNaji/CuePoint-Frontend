import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, shadow = true, className = "", ...props }) => {
  return (
    <div
      className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-4 ${
        shadow ? "shadow-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
