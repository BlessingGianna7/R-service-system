import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, fullWidth = true, className = '', ...rest }, ref) => {
    const width = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    
    return (
      <div className={`${width} ${className}`}>
        {label && (
          <label 
            htmlFor={rest.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`block ${width} rounded-md shadow-sm text-sm ${errorClass} transition-colors duration-200`}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Input; 