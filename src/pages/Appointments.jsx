import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as appointmentService from '../services/api/appointmentService';
import * as patientService from '../services/api/patientService';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // list, calendar
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Appointments</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="List" size={16} className="inline mr-1" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === 'calendar' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="Calendar" size={16} className="inline mr-1" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{todayAppointments.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Upcoming</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{upcomingAppointments.length}</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Completed</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {appointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Cancelled</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {appointments.filter(apt => apt.status === 'cancelled').length}
              </p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <ApperIcon name="XCircle" size={24} className="text-error" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No Appointments Scheduled</h3>
          <p className="text-surface-600">Schedule your first appointment to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today's Appointments */}
          {todayAppointments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-surface-200">
                <h2 className="text-lg font-semibold text-surface-900">Today's Appointments</h2>
              </div>
              <div className="divide-y divide-surface-200">
                {todayAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-surface-900">
                            {getPatientName(appointment.patientId)}
                          </h3>
                          <p className="text-sm text-surface-600">
                            {appointment.type} • {appointment.department}
                          </p>
                          <p className="text-xs text-surface-500">
                            Dr. {appointment.doctorId} • Room {appointment.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-surface-900">
                          {new Date(appointment.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                          className={`mt-1 text-xs font-medium rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary ${
                            appointment.status === 'pending' ? 'bg-warning/10 text-warning' :
                            appointment.status === 'confirmed' ? 'bg-info/10 text-info' :
                            appointment.status === 'completed' ? 'bg-success/10 text-success' :
                            'bg-error/10 text-error'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-surface-200">
                <h2 className="text-lg font-semibold text-surface-900">Upcoming Appointments</h2>
              </div>
              <div className="divide-y divide-surface-200">
                {upcomingAppointments.slice(0, 10).map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} className="text-info" />
                        </div>
                        <div>
                          <h3 className="font-medium text-surface-900">
                            {getPatientName(appointment.patientId)}
                          </h3>
                          <p className="text-sm text-surface-600">
                            {appointment.type} • {appointment.department}
                          </p>
                          <p className="text-xs text-surface-500">
                            Dr. {appointment.doctorId} • Room {appointment.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-surface-900">
                          {new Date(appointment.dateTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-surface-600">
                          {new Date(appointment.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <span className={`inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'pending' ? 'bg-warning/10 text-warning' :
                          appointment.status === 'confirmed' ? 'bg-info/10 text-info' :
                          appointment.status === 'completed' ? 'bg-success/10 text-success' :
                          'bg-error/10 text-error'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Appointments;