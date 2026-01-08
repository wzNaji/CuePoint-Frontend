/**
 * Button component
 *
 * Reusable, styled button wrapper around the native `<button>` element.
 *
 * Features:
 * - Variants: `primary` (filled) and `secondary` (outlined)
 * - Sizes: `sm`, `md`, `lg`
 * - Accepts all standard button props via `React.ButtonHTMLAttributes`
 *
 * Notes:
 * - `className` is appended last so callers can extend/override styles when needed.
 * - `focus:ring-*` classes provide accessible keyboard focus visibility.
 */
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: "primary" | "secondary";
  /** Button padding/text sizing preset. */
  size?: "sm" | "md" | "lg";
}

/**
   * Base styles shared by all buttons.
   * - Rounded corners and transition for a consistent UI feel
   * - Focus ring for accessibility
   */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "font-medium rounded-xl transition focus:outline-none focus:ring-2";

    /**
   * Variant-specific styles.
   * - primary: filled, uses your theme primary color
   * - secondary: outlined, neutral hover, red focus ring
   */
  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover focus:ring-primary"
      : "border border-neutral-700 text-neutral-200 hover:bg-neutral-800 focus:ring-red-600";

      /**
   * Size-specific styles.
   * Controls padding and font size.
   */
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2 text-md";

  return (
    <button
      className={`${base} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    />
  );
};

export default Button;
