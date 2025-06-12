import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import PatientListItem from '@/components/molecules/PatientListItem';
import EmptyState from '@/components/molecules/EmptyState';

const RecentAdmissions = ({ patients, onViewAllClick, onPatientClick }) => {
  return (
    <Card className="rounded-none shadow-none p-0">
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <Text as="h2" className="text-lg font-semibold text-surface-900">Recent Admissions</Text>
          <Button onClick={onViewAllClick} variant="text" className="text-sm font-medium">
            View All
          </Button>
        </div>
      </div>
      <div className="divide-y divide-surface-200">
        {patients.length === 0 ? (
          <EmptyState
            iconName="Users"
            title="No Recent Admissions"
            message="New patient admissions will appear here"
          />
        ) : (
          patients.map((patient, index) => (
            <PatientListItem
              key={patient.id}
              patient={patient}
              index={index}
              onClick={() => onPatientClick(patient.id)}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentAdmissions;