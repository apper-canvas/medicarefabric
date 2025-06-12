import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';

const PatientListItem = ({ patient, index, onClick }) => {
  const patientStatusColors = {
    admitted: 'bg-success/10 text-success',
    critical: 'bg-error/10 text-error',
    stable: 'bg-info/10 text-info',
    'discharge pending': 'bg-warning/10 text-warning',
  };

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md transition-all duration-200 cursor-pointer"
      motionProps={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.05 },
        whileHover: { y: -2 }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <Text as="h3" className="font-semibold text-surface-900">
              {patient.firstName} {patient.lastName}
            </Text>
            <Text as="p" className="text-sm text-surface-600">
              {patient.department} • Bed {patient.bedNumber}
            </Text>
            <Text as="p" className="text-xs text-surface-500">
              Dr. {patient.assignedDoctor} • {patient.phone}
            </Text>
          </div>
        </div>
        <div className="text-right">
          <StatusBadge status={patient.currentStatus} />
          <Text as="p" className="text-xs text-surface-500 mt-1">
            Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default PatientListItem;