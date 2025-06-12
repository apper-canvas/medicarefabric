import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import DepartmentCard from '@/components/molecules/DepartmentCard';
import DepartmentPatientsList from '@/components/organisms/DepartmentPatientsList';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Input from '@/components/atoms/Input';

import * as patientService from '@/services/api/patientService';
import * as staffService from '@/services/api/staffService';
import Card from '@/components/atoms/Card';

function DepartmentsPage() {
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departmentsData = [
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
    ? []
    : patients.filter(p => p.department === selectedDepartment);

  if (loading) {
    return <Loader count={6} type="card" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  const departmentOptions = [{ value: 'all', label: 'All Departments' }, ...departmentsData.map(dept => ({ value: dept.name, label: dept.name }))];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Departments"
        actions={
          <Input
            type="select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={departmentOptions}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentsData.map((department, index) => {
          const stats = getDepartmentStats(department.name);
          return (
            <DepartmentCard
              key={department.name}
              department={department}
              stats={stats}
              index={index}
              onClick={() => setSelectedDepartment(department.name)}
            />
          );
        })}
      </div>

      {selectedDepartment !== 'all' && (
        <DepartmentPatientsList
          patients={filteredPatients}
          selectedDepartment={selectedDepartment}
        />
      )}
    </div>
  );
}

export default DepartmentsPage;