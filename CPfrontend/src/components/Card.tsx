/**
 * Card component
 *
 * Simple layout wrapper that provides consistent background, border, rounding,
 * padding, and optional shadow. Useful for grouping related UI content.
 *
 * Features:
 * - Optional shadow via `shadow` prop (enabled by default)
 * - Accepts all standard div attributes (onClick, id, aria-*, etc.)
 * - Allows style extension via `className`
 */
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content. */
  children: React.ReactNode;
  /** Whether to apply a default drop shadow. */
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
