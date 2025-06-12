import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as patientService from '../services/api/patientService';
import * as staffService from '../services/api/staffService';

function Departments() {
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { name: 'Emergency', icon: 'Zap', color: 'error' },
    { name: 'Cardiology', icon: 'Heart', color: 'primary' },
    { name: 'Neurology', icon: 'Brain', color: 'info' },
    { name: 'Pediatrics', icon: 'Baby', color: 'success' },
    { name: 'Orthopedics', icon: 'Bone', color: 'warning' },
    { name: 'ICU', icon: 'Shield', color: 'error' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsData, staffData] = await Promise.all([
        patientService.getAll(),
        staffService.getAll()
      ]);
      setPatients(patientsData);
      setStaff(staffData);
    } catch (err) {
      setError(err.message || 'Failed to load department data');
      toast.error('Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = (departmentName) => {
    const deptPatients = patients.filter(p => p.department === departmentName);
    const deptStaff = staff.filter(s => s.department === departmentName);
    
    return {
      patients: deptPatients.length,
      staff: deptStaff.length,
      critical: deptPatients.filter(p => p.currentStatus === 'critical').length,
      occupancy: Math.round((deptPatients.length / 50) * 100) // Assuming 50 bed capacity per department
    };
  };

  const filteredPatients = selectedDepartment === 'all' 
    ? patients 
    : patients.filter(p => p.department === selectedDepartment);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
                  <div className="h-6 bg-surface-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                </div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Departments</h3>
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
        <h1 className="text-2xl font-bold text-surface-900">Departments</h1>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.name} value={dept.name}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department, index) => {
          const stats = getDepartmentStats(department.name);
          const colorClasses = {
            primary: 'bg-primary/10 text-primary',
            success: 'bg-success/10 text-success',
            warning: 'bg-warning/10 text-warning',
            error: 'bg-error/10 text-error',
            info: 'bg-info/10 text-info'
          };

          return (
            <motion.div
              key={department.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedDepartment(department.name)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[department.color]}`}>
                  <ApperIcon name={department.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">{department.name}</h3>
                  <p className="text-sm text-surface-600">Department Overview</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-surface-50 rounded-lg">
                  <p className="text-2xl font-bold text-surface-900">{stats.patients}</p>
                  <p className="text-xs text-surface-600">Patients</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-lg">
                  <p className="text-2xl font-bold text-surface-900">{stats.staff}</p>
                  <p className="text-xs text-surface-600">Staff</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-lg">
                  <p className="text-2xl font-bold text-error">{stats.critical}</p>
                  <p className="text-xs text-surface-600">Critical</p>
                </div>
                <div className="text-center p-3 bg-surface-50 rounded-lg">
                  <p className="text-2xl font-bold text-surface-900">{stats.occupancy}%</p>
                  <p className="text-xs text-surface-600">Occupancy</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Department Patients */}
      {selectedDepartment !== 'all' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">
              {selectedDepartment} Patients
            </h2>
          </div>
          <div className="divide-y divide-surface-200">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center">
                <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No Patients</h3>
                <p className="text-surface-600">No patients currently in this department</p>
              </div>
            ) : (
              filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-surface-900">
                          {patient.firstName} {patient.lastName}
                        </h4>
                        <p className="text-sm text-surface-600">
                          Bed {patient.bedNumber} • Dr. {patient.assignedDoctor}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      patient.currentStatus === 'admitted' ? 'bg-success/10 text-success' :
                      patient.currentStatus === 'critical' ? 'bg-error/10 text-error' :
                      patient.currentStatus === 'stable' ? 'bg-info/10 text-info' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {patient.currentStatus}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;