import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import BedDisplayItem from '@/components/molecules/BedDisplayItem';

const BedDisplay = ({ beds, patients, onUpdateStatus, viewMode, selectedWard }) => {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : null;
  };

  const filteredBeds = selectedWard === 'all'
    ? beds
    : beds.filter(bed => bed.ward === selectedWard);

  return (
    <Card className="p-0 rounded-none shadow-none">
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <Text as="h2" className="text-lg font-semibold text-surface-900">
            {selectedWard === 'all' ? 'All Beds' : `${selectedWard} Ward`}
          </Text>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <Text as="span" className="text-surface-600">Available</Text>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <Text as="span" className="text-surface-600">Occupied</Text>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <Text as="span" className="text-surface-600">Cleaning</Text>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-error rounded"></div>
              <Text as="span" className="text-surface-600">Maintenance</Text>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredBeds.map((bed, index) => (
              <BedDisplayItem
                key={bed.id}
                bed={bed}
                patientName={getPatientName(bed.patientId)}
                onUpdateStatus={onUpdateStatus}
                index={index}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBeds.map((bed, index) => (
              <BedDisplayItem
                key={bed.id}
                bed={bed}
                patientName={getPatientName(bed.patientId)}
                onUpdateStatus={onUpdateStatus}
                index={index}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BedDisplay;