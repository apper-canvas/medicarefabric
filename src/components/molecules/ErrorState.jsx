import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const ErrorState = ({ message, onRetry, className = '' }) => {
  return (
    <Card className={`p-8 text-center ${className}`}>
      <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
      <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Error Loading Data</Text>
      <Text as="p" className="text-surface-600 mb-4">{message || 'Failed to load data. Please try again.'}</Text>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Retry
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;