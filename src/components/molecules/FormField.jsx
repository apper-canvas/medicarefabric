import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon'; // Needed for Input atom's icon prop

const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options,
  rows,
  className = '',
  icon,
  ...props
}) => {
  return (
    <div className={className}>
      <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
        {label} {required && <span className="text-error">*</span>}
      </Text>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        options={options}
        rows={rows}
        icon={icon}
        apperIcon={ApperIcon} // Pass ApperIcon to Input
        {...props}
      />
    </div>
  );
};

export default FormField;