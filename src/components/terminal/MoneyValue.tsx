import React from 'react';

interface MoneyValueProps {
  value: string | number;
  decimals?: number;
  showSign?: boolean; // Show + for positive values
  colored?: boolean; // Apply cosmic-green/pink colors
  className?: string;
  prefix?: string;
}

export const MoneyValue: React.FC<MoneyValueProps> = ({ 
  value, 
  decimals = 2, 
  showSign = false,
  colored = true,
  className = '',
  prefix = '$'
}) => {
  const numVal = typeof value === 'string' ? parseFloat(value) : value;
  const absVal = Math.abs(numVal).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  const isNegative = numVal < 0;
  const isPositive = numVal > 0;
  
  let colorClass = '';
  if (colored) {
      if (isNegative) colorClass = 'text-cosmic-pink';
      else if (isPositive) colorClass = 'text-cosmic-green';
      else colorClass = 'text-white'; // Zero
  }

  return (
    <span className={`${colorClass} ${className}`}>
      {isNegative ? '-' : (showSign && isPositive ? '+' : '')}{prefix}{absVal}
    </span>
  );
};
