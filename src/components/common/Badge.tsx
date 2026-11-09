import React from 'react';
import { RegistrationStatus, SportType } from '../../types/database';

interface BadgeProps {
  status?: RegistrationStatus;
  sport?: SportType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  sport,
  label,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';

  let colorStyles = 'bg-grey-light text-nearblack border-nearblack';

  if (status) {
    switch (status) {
      case 'Active':
        colorStyles = 'bg-green-deep text-cream border-nearblack';
        break;
      case 'Closed':
        colorStyles = 'bg-red-brick text-cream border-nearblack';
        break;
      case 'Completed':
        colorStyles = 'bg-grey-light text-nearblack border-nearblack';
        break;
    }
  } else if (sport) {
    switch (sport) {
      case 'Cricket':
        colorStyles = 'bg-orange-accent text-cream border-nearblack';
        break;
      case 'Volleyball':
        colorStyles = 'bg-blue-cobalt text-cream border-nearblack';
        break;
      case 'Kabaddi':
        colorStyles = 'bg-yellow-accent text-nearblack border-nearblack';
        break;
    }
  }

  const text = label || status || sport || '';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider border-2 ${sizeStyles} ${colorStyles} shadow-brutal-sm ${className}`}
    >
      {text}
    </span>
  );
};
