import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as patientService from '../services/api/patientService';

function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    department: '',
    assignedDoctor: '',
    emergencyContact: { name: '', phone: '', relationship: '' }
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, statusFilter, departmentFilter]);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.currentStatus === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(patient => patient.department === departmentFilter);
    }

    setFilteredPatients(filtered);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const patientData = {
        ...newPatient,
        currentStatus: 'admitted',
        admissionDate: new Date().toISOString(),
        bedNumber: `${Math.floor(Math.random() * 300) + 1}`
      };
      
      const addedPatient = await patientService.create(patientData);
      setPatients([addedPatient, ...patients]);
      setShowAddForm(false);
      setNewPatient({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        department: '',
        assignedDoctor: '',
        emergencyContact: { name: '', phone: '', relationship: '' }
      });
      toast.success('Patient registered successfully');
    } catch (err) {
      toast.error('Failed to register patient');
    }
  };

  const departments = ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'ICU'];
  const statuses = ['admitted', 'critical', 'stable', 'discharge pending'];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Patients</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadPatients}
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
        <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Add Patient</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="text-sm text-surface-600 flex items-center">
            {filteredPatients.length} of {patients.length} patients
          </div>
        </div>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No Patients Found</h3>
          <p className="text-surface-600 mb-4">
            {patients.length === 0 ? 'Register your first patient to get started' : 'Try adjusting your search or filters'}
          </p>
          {patients.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Patient
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-surface-600">
                      {patient.department} • Bed {patient.bedNumber}
                    </p>
                    <p className="text-xs text-surface-500">
                      Dr. {patient.assignedDoctor} • {patient.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    patient.currentStatus === 'admitted' ? 'bg-success/10 text-success' :
                    patient.currentStatus === 'critical' ? 'bg-error/10 text-error' :
                    patient.currentStatus === 'stable' ? 'bg-info/10 text-info' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {patient.currentStatus}
                  </span>
                  <p className="text-xs text-surface-500 mt-1">
                    Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-surface-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-surface-900">Register New Patient</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleAddPatient} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.firstName}
                        onChange={(e) => setNewPatient({...newPatient, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.lastName}
                        onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Gender *
                      </label>
                      <select
                        required
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Department *
                      </label>
                      <select
                        required
                        value={newPatient.department}
                        onChange={(e) => setNewPatient({...newPatient, department: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Assigned Doctor *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPatient.assignedDoctor}
                        onChange={(e) => setNewPatient({...newPatient, assignedDoctor: e.target.value})}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="border-t border-surface-200 pt-6">
                    <h3 className="text-lg font-medium text-surface-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={newPatient.emergencyContact.name}
                          onChange={(e) => setNewPatient({
                            ...newPatient,
                            emergencyContact: {...newPatient.emergencyContact, name: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={newPatient.emergencyContact.phone}
                          onChange={(e) => setNewPatient({
                            ...newPatient,
                            emergencyContact: {...newPatient.emergencyContact, phone: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={newPatient.emergencyContact.relationship}
                          onChange={(e) => setNewPatient({
                            ...newPatient,
                            emergencyContact: {...newPatient.emergencyContact, relationship: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-surface-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Register Patient
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Patients;