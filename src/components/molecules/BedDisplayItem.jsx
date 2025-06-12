import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import Input from '@/components/atoms/Input'; // For status select

const BedDisplayItem = ({ bed, patientName, onUpdateStatus, index, viewMode = 'grid' }) => {
  const statusColors = {
    available: 'bg-success',
    occupied: 'bg-primary',
    cleaning: 'bg-warning',
    maintenance: 'bg-error',
  };

  const statusBackgrounds = {
    available: 'bg-success/10',
    occupied: 'bg-primary/10',
    cleaning: 'bg-warning/10',
    maintenance: 'bg-error/10',
  };

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  if (viewMode === 'grid') {
    return (
      <Card
        className={`relative text-white cursor-pointer transition-all duration-200 ${statusColors[bed.status]}`}
        motionProps={{
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: index * 0.02 },
          whileHover: { scale: 1.05 }
        }}
      >
        <div className="text-center">
          <ApperIcon name="Bed" size={24} className="mx-auto mb-2" />
          <Text as="p" className="font-medium">{bed.number}</Text>
          <Text as="p" className="text-xs opacity-80">{bed.ward}</Text>
          {patientName && (
            <Text as="p" className="text-xs opacity-90 mt-1 truncate" title={patientName}>
              {patientName}
            </Text>
          )}
        </div>
        {bed.status === 'occupied' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </Card>
    );
  }

  // List view
  return (
    <Card
      className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors rounded-none shadow-none"
      motionProps={{
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: index * 0.02 }
      }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-4 h-4 rounded-full ${statusColors[bed.status]}`}></div>
        <div>
          <Text as="p" className="font-medium text-surface-900">
            Bed {bed.number} - {bed.ward} Ward
          </Text>
          {patientName && (
            <Text as="p" className="text-sm text-surface-600">Patient: {patientName}</Text>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <StatusBadge status={bed.status} className={statusBackgrounds[bed.status]} />
        <Input
          type="select"
          value={bed.status}
          onChange={(e) => onUpdateStatus(bed.id, e.target.value)}
          options={statusOptions}
          className="text-sm border border-surface-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </Card>
  );
};

export default BedDisplayItem;