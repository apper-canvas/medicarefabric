import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import MetricCard from '@/components/molecules/MetricCard';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import AppointmentsList from '@/components/organisms/AppointmentsList';

import * as appointmentService from '@/services/api/appointmentService';
import * as patientService from '@/services/api/patientService';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // list, calendar
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Not used in current view, but kept for future calendar view

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const updatedAppointment = await appointmentService.update(appointmentId, {
        status: newStatus
      });

      setAppointments(appointments.map(apt =>
        apt.id === appointmentId ? updatedAppointment : apt
      ));

      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update appointment');
    }
  };

  const todayAppointmentsCount = appointments.filter(apt =>
    new Date(apt.dateTime).toDateString() === new Date().toDateString()
  ).length;

  const upcomingAppointmentsCount = appointments.filter(apt =>
    new Date(apt.dateTime) > new Date()
  ).length;

  const completedAppointmentsCount = appointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointmentsCount = appointments.filter(apt => apt.status === 'cancelled').length;

  if (loading) {
    return <Loader count={3} type="card" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Appointments"
        actions={
          <div className="flex items-center space-x-2 bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="List" size={16} className="inline mr-1" />
              <Text as="span">List</Text>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="Calendar" size={16} className="inline mr-1" />
              <Text as="span">Calendar</Text>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Appointments"
          value={todayAppointmentsCount}
          iconName="Calendar"
          iconColorClass="text-primary"
          bgColorClass="bg-primary/10"
          delay={0}
        />
        <MetricCard
          title="Upcoming"
          value={upcomingAppointmentsCount}
          iconName="Clock"
          iconColorClass="text-info"
          bgColorClass="bg-info/10"
          delay={0.1}
        />
        <MetricCard
          title="Completed"
          value={completedAppointmentsCount}
          iconName="CheckCircle"
          iconColorClass="text-success"
          bgColorClass="bg-success/10"
          delay={0.2}
        />
        <MetricCard
          title="Cancelled"
          value={cancelledAppointmentsCount}
          iconName="XCircle"
          iconColorClass="text-error"
          bgColorClass="bg-error/10"
          delay={0.3}
        />
      </div>

      <AppointmentsList
        appointments={appointments}
        patients={patients}
        onUpdateStatus={updateAppointmentStatus}
      />
    </div>
  );
}

export default AppointmentsPage;