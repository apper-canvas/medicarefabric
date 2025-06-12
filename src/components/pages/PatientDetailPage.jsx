import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PatientDetailHeader from '@/components/organisms/PatientDetailHeader';
import PatientOverview from '@/components/organisms/PatientOverview';
import PatientMedicalHistory from '@/components/organisms/PatientMedicalHistory';
import PatientTimeline from '@/components/organisms/PatientTimeline';
import TabNav from '@/components/molecules/TabNav';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Card from '@/components/atoms/Card';

import * as patientService from '@/services/api/patientService';

function PatientDetailPage() {
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
    return <Loader type="detail" />;
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <ErrorState
          message={error || 'The requested patient could not be found'}
          onRetry={() => navigate('/patients')}
          actionButton={{ label: 'Back to Patients', onClick: () => navigate('/patients') }}
        />
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
      <PatientDetailHeader
        patient={patient}
        onBackClick={() => navigate('/patients')}
        onStatusChange={updatePatientStatus}
      />

      <Card className="rounded-none shadow-none p-0">
        <div className="border-b border-surface-200">
          <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <PatientOverview patient={patient} />}
          {activeTab === 'medical' && <PatientMedicalHistory />}
          {activeTab === 'timeline' && <PatientTimeline patient={patient} />}
        </div>
      </Card>
    </div>
  );
}

export default PatientDetailPage;