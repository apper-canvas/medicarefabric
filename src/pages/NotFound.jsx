import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="AlertCircle" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-surface-900 mb-4">Page Not Found</h1>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Home" size={20} />
            <span>Go to Dashboard</span>
          </motion.button>
          
          <div className="text-sm text-surface-500">
            <button
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/80"
            >
              ← Go back to previous page
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;