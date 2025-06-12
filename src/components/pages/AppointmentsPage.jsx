import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import MetricCard from '@/components/molecules/MetricCard';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    dateTime: '',
    type: '',
    notes: '',
    status: 'Scheduled'
  });
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

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.dateTime || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreateLoading(true);
try {
      const selectedPatient = patients.find(p => p.id === parseInt(formData.patientId));
      const appointmentData = {
        ...formData,
        patient_id: parseInt(formData.patientId), // Use database field name
        patientName: selectedPatient?.name || 'Unknown Patient',
        doctorName: 'Dr. Smith', // Default doctor - could be made configurable
        department: selectedPatient?.department || 'General'
      };

      await appointmentService.create(appointmentData);

      await appointmentService.create(appointmentData);
      toast.success('Appointment created successfully');
      setShowCreateModal(false);
      setFormData({
        patientId: '',
        dateTime: '',
        type: '',
        notes: '',
        status: 'Scheduled'
      });
      loadData(); // Refresh the appointments list
    } catch (error) {
      toast.error('Failed to create appointment');
      console.error('Error creating appointment:', error);
    } finally {
      setCreateLoading(false);
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
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
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
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="bg-primary hover:bg-primary-600"
            >
              <ApperIcon name="Plus" size={16} />
              Create Appointment
            </Button>
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
      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Text variant="h3" className="font-semibold">Create Appointment</Text>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <FormField
                  label="Patient *"
                  id="patientId"
                  type="select"
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                  options={patients.map(patient => ({
                    value: patient.id,
                    label: patient.name
                  }))}
                  placeholder="Select a patient"
                  required
                />

                <FormField
                  label="Date & Time *"
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                  required
                />

                <FormField
                  label="Appointment Type *"
                  id="type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  options={[
                    { value: 'Consultation', label: 'Consultation' },
                    { value: 'Follow-up', label: 'Follow-up' },
                    { value: 'Check-up', label: 'Check-up' },
                    { value: 'Surgery', label: 'Surgery' },
                    { value: 'Lab Test', label: 'Lab Test' }
                  ]}
                  placeholder="Select appointment type"
                  required
                />

                <FormField
                  label="Notes"
                  id="notes"
                  type="textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={createLoading}
                    className="flex-1"
                  >
                    {createLoading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} />
                        Create Appointment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;