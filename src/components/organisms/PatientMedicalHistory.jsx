import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PatientMedicalHistory = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center py-12">
        <ApperIcon name="FileText" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Medical History</Text>
        <Text as="p" className="text-surface-600">Medical history and records will be displayed here</Text>
      </div>
    </motion.div>
  );
};

export default PatientMedicalHistory;