import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import EmptyState from '@/components/molecules/EmptyState';

const DepartmentPatientsList = ({ patients, selectedDepartment }) => {
  return (
    <Card className="rounded-none shadow-none p-0">
      <div className="p-6 border-b border-surface-200">
        <Text as="h2" className="text-lg font-semibold text-surface-900">
          {selectedDepartment} Patients
        </Text>
      </div>
      <div className="divide-y divide-surface-200">
        {patients.length === 0 ? (
          <EmptyState
            iconName="Users"
            title="No Patients"
            message="No patients currently in this department"
          />
        ) : (
          patients.map((patient, index) => (
            <div
              key={patient.id}
              className="p-4 hover:bg-surface-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <Text as="h4" className="font-medium text-surface-900">
                      {patient.firstName} {patient.lastName}
                    </Text>
                    <Text as="p" className="text-sm text-surface-600">
                      Bed {patient.bedNumber} • Dr. {patient.assignedDoctor}
                    </Text>
                  </div>
                </div>
                <StatusBadge status={patient.currentStatus} />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default DepartmentPatientsList;