import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;