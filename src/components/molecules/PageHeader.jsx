import React from 'react';
import Text from '@/components/atoms/Text';

const PageHeader = ({ title, actions, className = '' }) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <Text as="h1" className="text-2xl font-bold text-surface-900">{title}</Text>
      <div className="flex items-center space-x-4">
        {actions}
      </div>
    </div>
  );
};

export default PageHeader;