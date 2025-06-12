import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '@/components/molecules/PageHeader';
import AddPatientForm from '@/components/organisms/AddPatientForm';
import PatientListOrganism from '@/components/organisms/PatientListOrganism';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Card from '@/components/atoms/Card';

import * as patientService from '@/services/api/patientService';

function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const departments = ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'ICU'];
  const statuses = ['admitted', 'critical', 'stable', 'discharge pending'];

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
        `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone || '').includes(searchTerm) ||
        (patient.department || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.currentStatus === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(patient => patient.department === departmentFilter);
    }

    setFilteredPatients(filtered);
    setFilteredPatients(filtered);
  };

  const handleAddPatient = async (patientData) => {
    try {
      const patientToCreate = {
        ...patientData,
        currentStatus: 'admitted',
        admissionDate: new Date().toISOString(),
        bedNumber: `${Math.floor(Math.random() * 300) + 1}`
      };

      const addedPatient = await patientService.create(patientToCreate);
      setPatients([addedPatient, ...patients]);
      setShowAddForm(false);
      toast.success('Patient registered successfully');
    } catch (err) {
      toast.error('Failed to register patient');
    }
  };

  if (loading) {
    return <Loader count={5} type="list" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadPatients} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Patients"
        actions={
          <Button onClick={() => setShowAddForm(true)} icon="Plus" variant="primary">
            Add Patient
          </Button>
        }
      />

      <Card className="rounded-none shadow-none p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
            apperIcon={ApperIcon}
          />

          <Input
            type="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: 'all', label: 'All Status' }, ...statuses.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))]}
          />

          <Input
            type="select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[{ value: 'all', label: 'All Departments' }, ...departments.map(dept => ({ value: dept, label: dept }))]}
          />
        </div>
      </Card>

      <PatientListOrganism
        filteredPatients={filteredPatients}
        totalPatientsCount={patients.length}
        onPatientClick={(id) => navigate(`/patients/${id}`)}
        onAddFirstPatient={() => setShowAddForm(true)}
      />

      <AddPatientForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
}

export default PatientsPage;