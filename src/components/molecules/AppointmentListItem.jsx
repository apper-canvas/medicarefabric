import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import Input from '@/components/atoms/Input'; // For status select

const AppointmentListItem = ({ appointment, patientName, onUpdateStatus, index, type = 'today' }) => {
  const isToday = type === 'today';
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Card
      className="p-6 hover:bg-surface-50 transition-colors rounded-none shadow-none" // Adjust styling for list items
      motionProps={{
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: index * 0.05 }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${isToday ? 'bg-primary/10' : 'bg-info/10'} rounded-full flex items-center justify-center`}>
            <ApperIcon name="User" size={20} className={isToday ? 'text-primary' : 'text-info'} />
          </div>
          <div>
            <Text as="h3" className="font-medium text-surface-900">
              {patientName}
            </Text>
            <Text as="p" className="text-sm text-surface-600">
              {appointment.type} • {appointment.department}
            </Text>
            <Text as="p" className="text-xs text-surface-500">
              Dr. {appointment.doctorId} • Room {appointment.room}
            </Text>
          </div>
        </div>
        <div className="text-right">
          <Text as="p" className="font-medium text-surface-900">
            {isToday ? (
              new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            ) : (
              new Date(appointment.dateTime).toLocaleDateString()
            )}
          </Text>
          {!isToday && (
            <Text as="p" className="text-sm text-surface-600">
              {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
          {isToday ? (
            <Input
              type="select"
              value={appointment.status}
              onChange={(e) => onUpdateStatus(appointment.id, e.target.value)}
              options={statusOptions}
              className={`mt-1 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary ${
                appointment.status === 'pending' ? 'bg-warning/10 text-warning' :
                appointment.status === 'confirmed' ? 'bg-info/10 text-info' :
                appointment.status === 'completed' ? 'bg-success/10 text-success' :
                'bg-error/10 text-error'
              }`}
            />
          ) : (
            <StatusBadge status={appointment.status} className="mt-1" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentListItem;