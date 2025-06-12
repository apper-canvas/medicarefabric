import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import StatusBadge from '@/components/molecules/StatusBadge';
import Button from '@/components/atoms/Button';

const PatientListItem = ({ patient, index, onClick, onEdit, onDelete }) => {
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-lg border border-surface-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Text className="text-primary-600 font-medium text-sm">
                {patient.name?.charAt(0)?.toUpperCase() || patient.firstName?.charAt(0)?.toUpperCase() || 'P'}
              </Text>
            </div>
            <div className="min-w-0 flex-1">
              <Text className="font-medium text-surface-900 truncate">
                {patient.name || `${patient.firstName} ${patient.lastName}`}
              </Text>
              <div className="flex items-center space-x-4 text-sm text-surface-600 mt-1">
                <span className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  {patient.dateOfBirth}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Phone" size={14} className="mr-1" />
                  {patient.phone}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Building" size={14} className="mr-1" />
                  {patient.department}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={patient.currentStatus} />
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={handleEditClick}
                variant="secondary"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                title="Edit Patient"
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="secondary"
                className="p-2 hover:bg-red-50 hover:text-red-600"
                title="Delete Patient"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </div>
        
        {patient.assignedDoctor && (
          <div className="mt-3 pt-3 border-t border-surface-100">
            <div className="flex items-center text-sm text-surface-600">
              <ApperIcon name="UserCheck" size={14} className="mr-2" />
              <span>Dr. {patient.assignedDoctor}</span>
              {patient.bedNumber && (
                <>
                  <span className="mx-2">•</span>
                  <span>Bed {patient.bedNumber}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PatientListItem;