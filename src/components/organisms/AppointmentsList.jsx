import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import EmptyState from '@/components/molecules/EmptyState';
import AppointmentListItem from '@/components/molecules/AppointmentListItem';

const AppointmentsList = ({ appointments, patients, onUpdateStatus }) => {
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const todayAppointments = appointments.filter(apt =>
    new Date(apt.dateTime).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.dateTime) > new Date()
  ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  if (appointments.length === 0) {
    return (
      <EmptyState
        iconName="Calendar"
        title="No Appointments Scheduled"
        message="Schedule your first appointment to get started"
      />
    );
  }

  return (
    <div className="space-y-6">
      {todayAppointments.length > 0 && (
        <Card className="rounded-none shadow-none p-0">
          <div className="p-6 border-b border-surface-200">
            <Text as="h2" className="text-lg font-semibold text-surface-900">Today's Appointments</Text>
          </div>
          <div className="divide-y divide-surface-200">
            {todayAppointments.map((appointment, index) => (
              <AppointmentListItem
                key={appointment.id}
                appointment={appointment}
                patientName={getPatientName(appointment.patientId)}
                onUpdateStatus={onUpdateStatus}
                index={index}
                type="today"
              />
            ))}
          </div>
        </Card>
      )}

      {upcomingAppointments.length > 0 && (
        <Card className="rounded-none shadow-none p-0">
          <div className="p-6 border-b border-surface-200">
            <Text as="h2" className="text-lg font-semibold text-surface-900">Upcoming Appointments</Text>
          </div>
          <div className="divide-y divide-surface-200">
            {upcomingAppointments.slice(0, 10).map((appointment, index) => (
              <AppointmentListItem
                key={appointment.id}
                appointment={appointment}
                patientName={getPatientName(appointment.patientId)}
                onUpdateStatus={onUpdateStatus}
                index={index}
                type="upcoming"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsList;