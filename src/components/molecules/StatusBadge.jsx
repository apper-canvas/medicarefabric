import React from 'react';
import Text from '@/components/atoms/Text';

const StatusBadge = ({ status, className = '' }) => {
  let badgeClasses = '';
  switch (status) {
    case 'admitted':
    case 'completed':
    case 'active':
    case 'available':
    case 'healthy':
      badgeClasses = 'bg-success/10 text-success';
      break;
    case 'critical':
    case 'cancelled':
    case 'maintenance':
      badgeClasses = 'bg-error/10 text-error';
      break;
    case 'stable':
    case 'confirmed':
    case 'occupied':
    case 'info':
      badgeClasses = 'bg-info/10 text-info';
      break;
    case 'discharge pending':
    case 'pending':
    case 'cleaning':
    case 'warning':
      badgeClasses = 'bg-warning/10 text-warning';
      break;
    default:
      badgeClasses = 'bg-surface-200 text-surface-600';
  }

  return (
    <Text as="span" className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${badgeClasses} ${className}`}>
      {status}
    </Text>
  );
};

export default StatusBadge;