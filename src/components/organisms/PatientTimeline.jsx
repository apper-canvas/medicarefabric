import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const TimelineEvent = ({ date, title, description, colorClass }) => (
  <div className="flex items-start space-x-4">
    <div className={`w-3 h-3 rounded-full mt-2 ${colorClass}`}></div>
    <div>
      <Text as="p" className="font-medium text-surface-900">{title}</Text>
      <Text as="p" className="text-sm text-surface-600">{date}</Text>
      {description && <Text as="p" className="text-sm text-surface-500">{description}</Text>}
    </div>
  </div>
);

const PatientTimeline = ({ patient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <TimelineEvent
          title="Patient Admitted"
          date={new Date(patient.admissionDate).toLocaleString()}
          description={`Admitted to ${patient.department} department`}
          colorClass="bg-success"
        />

        <TimelineEvent
          title="Status Updated"
          date="Most Recent"
          description={`Current status: ${patient.currentStatus}`}
          colorClass="bg-info"
        />
        {/* Add more timeline events as needed */}
      </div>
    </motion.div>
  );
};

export default PatientTimeline;