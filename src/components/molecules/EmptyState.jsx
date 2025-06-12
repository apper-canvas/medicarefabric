import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const EmptyState = ({ iconName, title, message, actionButton, className = '' }) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <ApperIcon name={iconName} className="w-12 h-12 text-surface-300 mx-auto mb-4" />
      <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">{title}</Text>
      <Text as="p" className="text-surface-600 mb-4">{message}</Text>
      {actionButton && (
        <Button onClick={actionButton.onClick} variant="primary">
          {actionButton.label}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;