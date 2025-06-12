import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import * as patientService from '../services/api/patientService';
import * as appointmentService from '../services/api/appointmentService';
import * as bedService from '../services/api/bedService';

function MainFeature() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalPatients: 0,
    todayAdmissions: 0,
    availableBeds: 0,
    pendingAppointments: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [patients, appointments, beds] = await Promise.all([
          patientService.getAll(),
          appointmentService.getAll(),
          bedService.getAll()
        ]);

        // Calculate metrics
        const today = new Date().toDateString();
        const todayAdmissions = patients.filter(p => 
          new Date(p.admissionDate).toDateString() === today
        ).length;
        
        const availableBeds = beds.filter(b => b.status === 'available').length;
        const pendingAppointments = appointments.filter(a => a.status === 'pending').length;

        setMetrics({
          totalPatients: patients.length,
          todayAdmissions,
          availableBeds,
          pendingAppointments
        });

        // Get recent patients (last 5 admitted)
        const recent = patients
          .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
          .slice(0, 5);
        setRecentPatients(recent);

      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const metricCards = [
    {
      title: 'Total Patients',
      value: metrics.totalPatients,
      icon: 'Users',
      color: 'primary',
      change: '+5%'
    },
    {
      title: 'Today Admissions',
      value: metrics.todayAdmissions,
      icon: 'UserPlus',
      color: 'success',
      change: '+12%'
    },
    {
      title: 'Available Beds',
      value: metrics.availableBeds,
      icon: 'Bed',
      color: 'info',
      change: '-2%'
    },
    {
      title: 'Pending Appointments',
      value: metrics.pendingAppointments,
      icon: 'Clock',
      color: 'warning',
      change: '+8%'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Dashboard Error</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">{metric.title}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 ${
                  metric.change.startsWith('+') ? 'text-success' : 'text-error'
                }`}>
                  {metric.change} from last week
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                metric.color === 'primary' ? 'bg-primary/10' :
                metric.color === 'success' ? 'bg-success/10' :
                metric.color === 'info' ? 'bg-info/10' :
                'bg-warning/10'
              }`}>
                <ApperIcon 
                  name={metric.icon} 
                  size={24} 
                  className={
                    metric.color === 'primary' ? 'text-primary' :
                    metric.color === 'success' ? 'text-success' :
                    metric.color === 'info' ? 'text-info' :
                    'text-warning'
                  }
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">Recent Admissions</h2>
            <button
              onClick={() => navigate('/patients')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-surface-200">
          {recentPatients.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No Recent Admissions</h3>
              <p className="text-surface-600">New patient admissions will appear here</p>
            </div>
          ) : (
            recentPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-surface-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-surface-600">
                      {patient.department} • Bed {patient.bedNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      patient.currentStatus === 'admitted' ? 'bg-success/10 text-success' :
                      patient.currentStatus === 'critical' ? 'bg-error/10 text-error' :
                      patient.currentStatus === 'stable' ? 'bg-info/10 text-info' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {patient.currentStatus}
                    </span>
                    <p className="text-xs text-surface-500 mt-1">
                      {new Date(patient.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/patients')}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="UserPlus" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">New Patient</h3>
              <p className="text-sm text-surface-600">Register new admission</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/appointments')}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="Calendar" size={24} className="text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">Schedule</h3>
              <p className="text-sm text-surface-600">Book appointment</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/beds')}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="Bed" size={24} className="text-info" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">Bed Status</h3>
              <p className="text-sm text-surface-600">Check availability</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

export default MainFeature;