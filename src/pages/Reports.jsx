import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as patientService from '../services/api/patientService';
import * as appointmentService from '../services/api/appointmentService';
import * as bedService from '../services/api/bedService';

function Reports() {
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    beds: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [reportType, setReportType] = useState('overview');

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

    // Patient metrics
    const totalPatients = data.patients.length;
    const newPatients = data.patients.filter(p => 
      new Date(p.admissionDate) >= cutoffDate
    ).length;
    const criticalPatients = data.patients.filter(p => 
      p.currentStatus === 'critical'
    ).length;

    // Department breakdown
    const departmentStats = {};
    data.patients.forEach(patient => {
      departmentStats[patient.department] = (departmentStats[patient.department] || 0) + 1;
    });

    // Bed occupancy
    const totalBeds = data.beds.length;
    const occupiedBeds = data.beds.filter(b => b.status === 'occupied').length;
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

    // Appointment metrics
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
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Reports</h3>
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

  const metrics = calculateMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="departments">Departments</option>
            <option value="occupancy">Occupancy</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Patients</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{metrics.totalPatients}</p>
              <p className="text-xs text-success mt-1">+{metrics.newPatients} new this {dateRange}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Bed Occupancy</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{metrics.occupancyRate}%</p>
              <p className="text-xs text-surface-500 mt-1">{metrics.occupiedBeds}/{metrics.totalBeds} beds</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="Bed" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Critical Patients</p>
              <p className="text-2xl font-bold text-error mt-1">{metrics.criticalPatients}</p>
              <p className="text-xs text-surface-500 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <ApperIcon name="AlertTriangle" size={24} className="text-error" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Appointment Rate</p>
              <p className="text-2xl font-bold text-success mt-1">{metrics.completionRate}%</p>
              <p className="text-xs text-surface-500 mt-1">Completion rate</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Analytics */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Department Analytics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(metrics.departmentStats).map(([department, count], index) => {
              const trend = getDepartmentTrend(department);
              const percentage = metrics.totalPatients > 0 
                ? Math.round((count / metrics.totalPatients) * 100) 
                : 0;

              return (
                <motion.div
                  key={department}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-surface-900">{department}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trend.value > 0 ? 'bg-success/10 text-success' :
                      trend.value < 0 ? 'bg-error/10 text-error' :
                      'bg-surface-200 text-surface-600'
                    }`}>
                      {trend.value > 0 ? '+' : ''}{trend.percentage}%
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-surface-900">{count}</p>
                      <p className="text-xs text-surface-600">patients ({percentage}%)</p>
                    </div>
                    <div className="w-16 h-8 bg-primary/20 rounded">
                      <div 
                        className="bg-primary rounded h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Key Insights</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-surface-900">High Occupancy Alert</h4>
                  <p className="text-sm text-surface-600">
                    Current bed occupancy is at {metrics.occupancyRate}%. Consider preparing overflow protocols.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-surface-900">Appointment Efficiency</h4>
                  <p className="text-sm text-surface-600">
                    {metrics.completionRate}% appointment completion rate shows excellent patient care delivery.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-surface-900">Department Load</h4>
                  <p className="text-sm text-surface-600">
                    {Object.keys(metrics.departmentStats)[0]} department has the highest patient load.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-surface-900">Critical Care</h4>
                  <p className="text-sm text-surface-600">
                    {metrics.criticalPatients} patients require immediate attention and monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;