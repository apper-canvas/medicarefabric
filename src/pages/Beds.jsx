import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import * as bedService from '../services/api/bedService';
import * as patientService from '../services/api/patientService';

function Beds() {
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
      const updatedBed = await bedService.update(bedId, {
        status: newStatus,
        patientId: patientId,
        lastCleaned: newStatus === 'cleaning' ? new Date().toISOString() : undefined
      });
      
      setBeds(beds.map(bed => bed.id === bedId ? updatedBed : bed));
      toast.success(`Bed ${updatedBed.number} status updated`);
    } catch (err) {
      toast.error('Failed to update bed status');
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : null;
  };

  const filteredBeds = selectedWard === 'all' 
    ? beds 
    : beds.filter(bed => bed.ward === selectedWard);

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length
  };

  const occupancyRate = Math.round((bedStats.occupied / bedStats.total) * 100);

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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Beds</h3>
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
        <h1 className="text-2xl font-bold text-surface-900">Bed Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Wards</option>
            {wards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2 bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="Grid3X3" size={16} className="inline mr-1" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-600'
              }`}
            >
              <ApperIcon name="List" size={16} className="inline mr-1" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Beds</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{bedStats.total}</p>
            </div>
            <div className="p-3 bg-surface-100 rounded-lg">
              <ApperIcon name="Bed" size={24} className="text-surface-600" />
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
              <p className="text-sm font-medium text-surface-600">Available</p>
              <p className="text-2xl font-bold text-success mt-1">{bedStats.available}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
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
              <p className="text-sm font-medium text-surface-600">Occupied</p>
              <p className="text-2xl font-bold text-primary mt-1">{bedStats.occupied}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="User" size={24} className="text-primary" />
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
              <p className="text-sm font-medium text-surface-600">Cleaning</p>
              <p className="text-2xl font-bold text-warning mt-1">{bedStats.cleaning}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <ApperIcon name="Sparkles" size={24} className="text-warning" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{occupancyRate}%</p>
            </div>
            <div className="p-3 bg-info/10 rounded-lg">
              <ApperIcon name="BarChart3" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bed Layout */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900">
              {selectedWard === 'all' ? 'All Beds' : `${selectedWard} Ward`}
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-success rounded"></div>
                <span className="text-surface-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className="text-surface-600">Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-warning rounded"></div>
                <span className="text-surface-600">Cleaning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-error rounded"></div>
                <span className="text-surface-600">Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {filteredBeds.map((bed, index) => {
                const patientName = bed.patientId ? getPatientName(bed.patientId) : null;
                const statusColors = {
                  available: 'bg-success hover:bg-success/80',
                  occupied: 'bg-primary hover:bg-primary/80',
                  cleaning: 'bg-warning hover:bg-warning/80',
                  maintenance: 'bg-error hover:bg-error/80'
                };

                return (
                  <motion.div
                    key={bed.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative p-4 rounded-lg text-white cursor-pointer transition-all duration-200 ${statusColors[bed.status]}`}
                    onClick={() => {
                      // Here you could implement bed assignment/discharge logic
                    }}
                  >
                    <div className="text-center">
                      <ApperIcon name="Bed" size={24} className="mx-auto mb-2" />
                      <p className="font-medium">{bed.number}</p>
                      <p className="text-xs opacity-80">{bed.ward}</p>
                      {patientName && (
                        <p className="text-xs opacity-90 mt-1 truncate" title={patientName}>
                          {patientName}
                        </p>
                      )}
                    </div>
                    
                    {bed.status === 'occupied' && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBeds.map((bed, index) => {
                const patientName = bed.patientId ? getPatientName(bed.patientId) : null;
                
                return (
                  <motion.div
                    key={bed.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        bed.status === 'available' ? 'bg-success' :
                        bed.status === 'occupied' ? 'bg-primary' :
                        bed.status === 'cleaning' ? 'bg-warning' :
                        'bg-error'
                      }`}></div>
                      <div>
                        <p className="font-medium text-surface-900">
                          Bed {bed.number} - {bed.ward} Ward
                        </p>
                        {patientName && (
                          <p className="text-sm text-surface-600">Patient: {patientName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        bed.status === 'available' ? 'bg-success/10 text-success' :
                        bed.status === 'occupied' ? 'bg-primary/10 text-primary' :
                        bed.status === 'cleaning' ? 'bg-warning/10 text-warning' :
                        'bg-error/10 text-error'
                      }`}>
                        {bed.status}
                      </span>
                      
                      <select
                        value={bed.status}
                        onChange={(e) => updateBedStatus(bed.id, e.target.value)}
                        className="text-sm border border-surface-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Beds;