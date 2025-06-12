import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import MetricCard from '@/components/molecules/MetricCard';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import BedDisplay from '@/components/organisms/BedDisplay';

import * as bedService from '@/services/api/bedService';
import * as patientService from '@/services/api/patientService';

function BedsPage() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWard, setSelectedWard] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const wards = ['General', 'ICU', 'Emergency', 'Pediatrics', 'Maternity', 'Surgery'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bedsData, patientsData] = await Promise.all([
        bedService.getAll(),
        patientService.getAll()
      ]);
      setBeds(bedsData);
      setPatients(patientsData);
    } catch (err) {
      setError(err.message || 'Failed to load bed data');
      toast.error('Failed to load bed data');
    } finally {
      setLoading(false);
    }
  };

const updateBedStatus = async (bedId, newStatus, patientId = null) => {
    try {
      const updateData = {
        status: newStatus,
        patient_id: patientId ? parseInt(patientId) : null, // Use database field name and ensure integer
        last_cleaned: newStatus === 'cleaning' ? new Date().toISOString() : undefined
      };

      const updatedBed = await bedService.update(bedId, updateData);

      setBeds(beds.map(bed => bed.id === bedId ? updatedBed : bed));
      toast.success(`Bed ${updatedBed.number} status updated`);
    } catch (err) {
      toast.error('Failed to update bed status');
    }
  };

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length
  };

  const occupancyRate = bedStats.total > 0 ? Math.round((bedStats.occupied / bedStats.total) * 100) : 0;

  if (loading) {
    return <Loader count={4} type="card" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  const wardOptions = [{ value: 'all', label: 'All Wards' }, ...wards.map(w => ({ value: w, label: w }))];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Bed Management"
        actions={
          <>
            <Input
              type="select"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              options={wardOptions}
            />

            <div className="flex items-center space-x-2 bg-surface-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
                }`}
              >
                <ApperIcon name="Grid3X3" size={16} className="inline mr-1" />
                <Text as="span">Grid</Text>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
                }`}
              >
                <ApperIcon name="List" size={16} className="inline mr-1" />
                <Text as="span">List</Text>
              </button>
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricCard
          title="Total Beds"
          value={bedStats.total}
          iconName="Bed"
          iconColorClass="text-surface-600"
          bgColorClass="bg-surface-100"
          delay={0}
        />
        <MetricCard
          title="Available"
          value={bedStats.available}
          iconName="CheckCircle"
          iconColorClass="text-success"
          bgColorClass="bg-success/10"
          delay={0.1}
        />
        <MetricCard
          title="Occupied"
          value={bedStats.occupied}
          iconName="User"
          iconColorClass="text-primary"
          bgColorClass="bg-primary/10"
          delay={0.2}
        />
        <MetricCard
          title="Cleaning"
          value={bedStats.cleaning}
          iconName="Sparkles"
          iconColorClass="text-warning"
          bgColorClass="bg-warning/10"
          delay={0.3}
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          iconName="BarChart3"
          iconColorClass="text-info"
          bgColorClass="bg-info/10"
          delay={0.4}
        />
      </div>

      <BedDisplay
        beds={beds}
        patients={patients}
        onUpdateStatus={updateBedStatus}
        viewMode={viewMode}
        selectedWard={selectedWard}
      />
    </div>
  );
}

export default BedsPage;