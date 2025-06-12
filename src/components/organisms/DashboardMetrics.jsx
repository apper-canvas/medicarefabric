import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';

const DashboardMetrics = ({ metrics, loading, error, onRetry }) => {
  const metricCardsData = [
    {
      title: 'Total Patients',
      value: metrics.totalPatients,
      iconName: 'Users',
      iconColorClass: 'text-primary',
      bgColorClass: 'bg-primary/10',
      changeText: `+5% from last week`,
      changeType: 'positive'
    },
    {
      title: 'Today Admissions',
      value: metrics.todayAdmissions,
      iconName: 'UserPlus',
      iconColorClass: 'text-success',
      bgColorClass: 'bg-success/10',
      changeText: `+12% from last week`,
      changeType: 'positive'
    },
    {
      title: 'Available Beds',
      value: metrics.availableBeds,
      iconName: 'Bed',
      iconColorClass: 'text-info',
      bgColorClass: 'bg-info/10',
      changeText: `-2% from last week`,
      changeType: 'negative'
    },
    {
      title: 'Pending Appointments',
      value: metrics.pendingAppointments,
      iconName: 'Clock',
      iconColorClass: 'text-warning',
      bgColorClass: 'bg-warning/10',
      changeText: `+8% from last week`,
      changeType: 'positive'
    }
  ];

  if (loading) {
    return <Loader count={4} type="card" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCardsData.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default DashboardMetrics;