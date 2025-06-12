import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as patientService from '../services/api/patientService';

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getById(id);
      setPatient(data);
    } catch (err) {
      setError(err.message || 'Failed to load patient');
      toast.error('Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  const updatePatientStatus = async (newStatus) => {
    try {
      const updatedPatient = await patientService.update(id, {
        currentStatus: newStatus
      });
      setPatient(updatedPatient);
      toast.success(`Patient status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update patient status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-surface-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-surface-200 rounded w-48"></div>
                <div className="h-4 bg-surface-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-6 bg-surface-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Patient Not Found</h3>
          <p className="text-surface-600 mb-4">{error || 'The requested patient could not be found'}</p>
          <button
            onClick={() => navigate('/patients')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'medical', label: 'Medical History', icon: 'FileText' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center space-x-2 text-surface-600 hover:text-surface-900 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to Patients</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <select
              value={patient.currentStatus}
              onChange={(e) => updatePatientStatus(e.target.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary ${
                patient.currentStatus === 'admitted' ? 'bg-success/10 text-success' :
                patient.currentStatus === 'critical' ? 'bg-error/10 text-error' :
                patient.currentStatus === 'stable' ? 'bg-info/10 text-info' :
                'bg-warning/10 text-warning'
              }`}
            >
              <option value="admitted">Admitted</option>
              <option value="critical">Critical</option>
              <option value="stable">Stable</option>
              <option value="discharge pending">Discharge Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-surface-600">
              {patient.department} • Bed {patient.bedNumber} • Dr. {patient.assignedDoctor}
            </p>
            <p className="text-sm text-surface-500">
              Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-surface-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-surface-500 hover:text-surface-700'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-surface-500 mb-2">Date of Birth</h3>
                  <p className="text-surface-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500 mb-2">Gender</h3>
                  <p className="text-surface-900 capitalize">{patient.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500 mb-2">Phone</h3>
                  <p className="text-surface-900">{patient.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-surface-500 mb-2">Email</h3>
                  <p className="text-surface-900">{patient.email || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-surface-500 mb-2">Address</h3>
                  <p className="text-surface-900">{patient.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              {patient.emergencyContact && (
                <div className="border-t border-surface-200 pt-6">
                  <h3 className="text-lg font-medium text-surface-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-surface-500 mb-1">Name</h4>
                      <p className="text-surface-900">{patient.emergencyContact.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-surface-500 mb-1">Phone</h4>
                      <p className="text-surface-900">{patient.emergencyContact.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-surface-500 mb-1">Relationship</h4>
                      <p className="text-surface-900">{patient.emergencyContact.relationship || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'medical' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-12">
                <ApperIcon name="FileText" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">Medical History</h3>
                <p className="text-surface-600">Medical history and records will be displayed here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-success rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-surface-900">Patient Admitted</p>
                    <p className="text-sm text-surface-600">
                      {new Date(patient.admissionDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-surface-500">
                      Admitted to {patient.department} department
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-info rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-surface-900">Status Updated</p>
                    <p className="text-sm text-surface-600">Current status: {patient.currentStatus}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDetail;