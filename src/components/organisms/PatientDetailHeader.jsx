import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';

const PatientDetailHeader = ({ patient, onBackClick, onStatusChange }) => {
  const statusOptions = [
    { value: 'admitted', label: 'Admitted' },
    { value: 'critical', label: 'Critical' },
    { value: 'stable', label: 'Stable' },
    { value: 'discharge pending', label: 'Discharge Pending' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBackClick} variant="text" icon="ArrowLeft">
          Back to Patients
        </Button>
        <div className="flex items-center space-x-3">
          <Input
            type="select"
            value={patient.currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
            className={`px-3 py-1 text-sm font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary ${
              patient.currentStatus === 'admitted' ? 'bg-success/10 text-success' :
              patient.currentStatus === 'critical' ? 'bg-error/10 text-error' :
              patient.currentStatus === 'stable' ? 'bg-info/10 text-info' :
              'bg-warning/10 text-warning'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={32} className="text-primary" />
        </div>
        <div>
          <Text as="h1" className="text-2xl font-bold text-surface-900">
            {patient.firstName} {patient.lastName}
          </Text>
          <Text as="p" className="text-surface-600">
            {patient.department} • Bed {patient.bedNumber} • Dr. {patient.assignedDoctor}
          </Text>
          <Text as="p" className="text-sm text-surface-500">
            Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientDetailHeader;