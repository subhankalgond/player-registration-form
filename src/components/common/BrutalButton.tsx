import React from 'react';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'orange' | 'nearblack' | 'yellow' | 'red' | 'cream' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({
  variant = 'orange',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseStyles =
    'font-display uppercase tracking-wider inline-flex items-center justify-center border-2 border-nearblack transition-all duration-150 select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-brutal-sm',
    md: 'text-sm px-5 py-2.5 gap-2 shadow-brutal',
    lg: 'text-base px-7 py-3.5 gap-3 shadow-brutal-lg',
  };

  const variantStyles = {
    orange: 'bg-orange-accent text-cream hover:bg-orange-600',
    nearblack: 'bg-nearblack text-cream hover:bg-nearblack-800',
    yellow: 'bg-yellow-accent text-nearblack hover:bg-yellow-400',
    red: 'bg-red-brick text-cream hover:bg-red-700',
    cream: 'bg-cream text-nearblack hover:bg-cream-200',
    outline: 'bg-transparent text-nearblack hover:bg-cream-200',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed active:translate-x-0 active:translate-y-0 active:shadow-brutal'
    : 'cursor-pointer';

  return (
    <button
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabledStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
