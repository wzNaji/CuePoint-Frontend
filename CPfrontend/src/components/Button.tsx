import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "font-medium rounded-xl transition focus:outline-none focus:ring-2";

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover focus:ring-primary"
      : "border border-neutral-700 text-neutral-200 hover:bg-neutral-800 focus:ring-red-600";

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
