import React from 'react';
import PatientListItem from '@/components/molecules/PatientListItem';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PatientListOrganism = ({ filteredPatients, totalPatientsCount, onPatientClick, onAddFirstPatient }) => {
  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-sm text-surface-600 flex items-center">
          <Text>{filteredPatients.length} of {totalPatientsCount} patients</Text>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <EmptyState
          iconName="Users"
          title="No Patients Found"
          message={totalPatientsCount === 0 ? 'Register your first patient to get started' : 'Try adjusting your search or filters'}
          actionButton={totalPatientsCount === 0 ? { label: 'Add First Patient', onClick: onAddFirstPatient } : null}
        />
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient, index) => (
            <PatientListItem
              key={patient.id}
              patient={patient}
              index={index}
              onClick={() => onPatientClick(patient.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PatientListOrganism;