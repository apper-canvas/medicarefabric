import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardMetrics from '@/components/organisms/DashboardMetrics';
import RecentAdmissions from '@/components/organisms/RecentAdmissions';
import QuickActions from '@/components/organisms/QuickActions';

import * as patientService from '@/services/api/patientService';
import * as appointmentService from '@/services/api/appointmentService';
import * as bedService from '@/services/api/bedService';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';

function HomePage() {
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

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patients, appointments, beds] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        bedService.getAll()
      ]);

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

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loader count={4} type="card" />;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardMetrics metrics={metrics} loading={loading} error={error} onRetry={loadDashboardData} />
      <RecentAdmissions patients={recentPatients} onViewAllClick={() => navigate('/patients')} onPatientClick={(id) => navigate(`/patients/${id}`)} />
      <QuickActions onNavigate={navigate} />
    </div>
  );
}

export default HomePage;