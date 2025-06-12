import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const DepartmentCard = ({ department, stats, index, onClick }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info'
  };

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md transition-all duration-200 cursor-pointer"
      motionProps={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.1 },
        whileHover: { y: -2 }
      }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[department.color]}`}>
          <ApperIcon name={department.icon} size={24} />
        </div>
        <div>
          <Text as="h3" className="text-lg font-semibold text-surface-900">{department.name}</Text>
          <Text as="p" className="text-sm text-surface-600">Department Overview</Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <Text as="p" className="text-2xl font-bold text-surface-900">{stats.patients}</Text>
          <Text as="p" className="text-xs text-surface-600">Patients</Text>
        </div>
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <Text as="p" className="text-2xl font-bold text-surface-900">{stats.staff}</Text>
          <Text as="p" className="text-xs text-surface-600">Staff</Text>
        </div>
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <Text as="p" className="text-2xl font-bold text-error">{stats.critical}</Text>
          <Text as="p" className="text-xs text-surface-600">Critical</Text>
        </div>
        <div className="text-center p-3 bg-surface-50 rounded-lg">
          <Text as="p" className="text-2xl font-bold text-surface-900">{stats.occupancy}%</Text>
          <Text as="p" className="text-xs text-surface-600">Occupancy</Text>
        </div>
      </div>
    </Card>
  );
};

export default DepartmentCard;