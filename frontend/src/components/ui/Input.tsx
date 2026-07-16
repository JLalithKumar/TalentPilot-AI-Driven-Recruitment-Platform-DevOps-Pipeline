import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, id, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        id={id}
        className={classNames('input-field', className, { 'border-red-500 focus:ring-red-500/50 focus:border-red-500': error })}
        {...props}
      />
      {error && <span className="text-xs text-red-500 animate-fade-in">{error}</span>}
    </div>
  );
};
