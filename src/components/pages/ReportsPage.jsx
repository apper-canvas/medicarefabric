import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PageHeader from '@/components/molecules/PageHeader';
import MetricCard from '@/components/molecules/MetricCard';
import DepartmentAnalytics from '@/components/organisms/DepartmentAnalytics';
import Loader from '@/components/molecules/Loader';
import ErrorState from '@/components/molecules/ErrorState';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

import * as patientService from '@/services/api/patientService';
import * as appointmentService from '@/services/api/appointmentService';
import * as bedService from '@/services/api/bedService';

function ReportsPage() {
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    beds: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [reportType, setReportType] = useState('overview'); // overview, departments, occupancy

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patients, appointments, beds] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        bedService.getAll()
      ]);

      setData({ patients, appointments, beds });
    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const now = new Date();
    const ranges = {
      week: 7,
      month: 30,
      year: 365
    };

    const daysBack = ranges[dateRange];
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    const totalPatients = data.patients.length;
    const newPatients = data.patients.filter(p =>
      new Date(p.admissionDate) >= cutoffDate
    ).length;
    const criticalPatients = data.patients.filter(p =>
      p.currentStatus === 'critical'
    ).length;

    const departmentStats = {};
    data.patients.forEach(patient => {
      departmentStats[patient.department] = (departmentStats[patient.department] || 0) + 1;
    });

    const totalBeds = data.beds.length;
    const occupiedBeds = data.beds.filter(b => b.status === 'occupied').length;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const totalAppointments = data.appointments.length;
    const completedAppointments = data.appointments.filter(a =>
      a.status === 'completed'
    ).length;
    const completionRate = totalAppointments > 0
      ? Math.round((completedAppointments / totalAppointments) * 100)
      : 0;

    return {
      totalPatients,
      newPatients,
      criticalPatients,
      departmentStats,
      occupancyRate,
      completionRate,
      totalBeds,
      occupiedBeds
    };
  };

  const getDepartmentTrend = (department) => {
    const deptPatients = data.patients.filter(p => p.department === department);
    const lastWeek = deptPatients.filter(p => {
      const admissionDate = new Date(p.admissionDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return admissionDate >= weekAgo;
    }).length;

    const prevWeek = deptPatients.filter(p => {
      const admissionDate = new Date(p.admissionDate);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return admissionDate >= twoWeeksAgo && admissionDate < weekAgo;
    }).length;

    const trend = lastWeek - prevWeek;
    return {
      value: trend,
      percentage: prevWeek > 0 ? Math.round((trend / prevWeek) * 100) : 0
    };
  };

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

  const metrics = calculateMetrics();

  const dateRangeOptions = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' }
  ];

  const reportTypeOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'departments', label: 'Departments' },
    { value: 'occupancy', label: 'Occupancy' }
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Reports & Analytics"
        actions={
          <>
            <Input
              type="select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={dateRangeOptions}
            />
            <Input
              type="select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportTypeOptions}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value={metrics.totalPatients}
          iconName="Users"
          iconColorClass="text-primary"
          bgColorClass="bg-primary/10"
          changeText={`+${metrics.newPatients} new this ${dateRange}`}
          changeType="positive"
          delay={0}
        />
        <MetricCard
          title="Bed Occupancy"
          value={`${metrics.occupancyRate}%`}
          iconName="Bed"
          iconColorClass="text-info"
          bgColorClass="bg-info/10"
          changeText={`${metrics.occupiedBeds}/${metrics.totalBeds} beds`}
          changeType="neutral"
          delay={0.1}
        />
        <MetricCard
          title="Critical Patients"
          value={metrics.criticalPatients}
          iconName="AlertTriangle"
          iconColorClass="text-error"
          bgColorClass="bg-error/10"
          changeText="Requires attention"
          changeType={metrics.criticalPatients > 0 ? 'negative' : 'neutral'}
          delay={0.2}
        />
        <MetricCard
          title="Appointment Rate"
          value={`${metrics.completionRate}%`}
          iconName="CheckCircle"
          iconColorClass="text-success"
          bgColorClass="bg-success/10"
          changeText="Completion rate"
          changeType={metrics.completionRate >= 75 ? 'positive' : 'neutral'}
          delay={0.3}
        />
      </div>

      <DepartmentAnalytics
        departmentStats={metrics.departmentStats}
        totalPatients={metrics.totalPatients}
        getDepartmentTrend={getDepartmentTrend}
      />

      <Card className="rounded-none shadow-none p-0">
        <div className="p-6 border-b border-surface-200">
          <Text as="h2" className="text-lg font-semibold text-surface-900">Key Insights</Text>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <Text as="h4" className="font-medium text-surface-900">High Occupancy Alert</Text>
                  <Text as="p" className="text-sm text-surface-600">
                    Current bed occupancy is at {metrics.occupancyRate}%. Consider preparing overflow protocols.
                  </Text>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div>
                  <Text as="h4" className="font-medium text-surface-900">Appointment Efficiency</Text>
                  <Text as="p" className="text-sm text-surface-600">
                    {metrics.completionRate}% appointment completion rate shows excellent patient care delivery.
                  </Text>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div>
                  <Text as="h4" className="font-medium text-surface-900">Department Load</Text>
                  <Text as="p" className="text-sm text-surface-600">
                    {Object.keys(metrics.departmentStats)[0]} department has the highest patient load.
                  </Text>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                <div>
                  <Text as="h4" className="font-medium text-surface-900">Critical Care</Text>
                  <Text as="p" className="text-sm text-surface-600">
                    {metrics.criticalPatients} patients require immediate attention and monitoring.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ReportsPage;