import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const InfoItem = ({ label, value }) => (
  <div>
    <Text as="h3" className="text-sm font-medium text-surface-500 mb-2">{label}</Text>
    <Text as="p" className="text-surface-900">{value}</Text>
  </div>
);

const PatientOverview = ({ patient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoItem label="Date of Birth" value={new Date(patient.dateOfBirth).toLocaleDateString()} />
        <InfoItem label="Gender" value={patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} />
        <InfoItem label="Phone" value={patient.phone} />
        <InfoItem label="Email" value={patient.email || 'Not provided'} />
        <div className="md:col-span-2">
          <InfoItem label="Address" value={patient.address || 'Not provided'} />
        </div>
      </div>

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="border-t border-surface-200 pt-6">
          <Text as="h3" className="text-lg font-medium text-surface-900 mb-4">Emergency Contact</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Name" value={patient.emergencyContact.name || 'Not provided'} />
            <InfoItem label="Phone" value={patient.emergencyContact.phone || 'Not provided'} />
            <InfoItem label="Relationship" value={patient.emergencyContact.relationship || 'Not provided'} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientOverview;