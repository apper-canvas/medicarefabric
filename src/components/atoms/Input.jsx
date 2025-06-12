import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder,
  required = false,
  options, // For select type: [{ value: '...', label: '...' }]
  rows = 3, // For textarea type
  icon, // ApperIcon name for text inputs
  iconSize = 20,
  apperIcon: ApperIcon, // Pass ApperIcon component if needed for icon prop
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
  const combinedClasses = `${baseClasses} ${className}`;

  if (type === 'select' && options) {
    return (
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={combinedClasses}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={value !== ''}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className={combinedClasses}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    );
  }

  return (
    <div className="relative">
      {icon && ApperIcon && (
        <ApperIcon name={icon} size={iconSize} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`${combinedClasses} ${icon ? 'pl-10 pr-4' : ''}`}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;