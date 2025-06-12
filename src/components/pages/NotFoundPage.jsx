import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function NotFoundPage() {
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

        <Text as="h1" className="text-4xl font-bold text-surface-900 mb-4">Page Not Found</Text>
        <Text as="p" className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </Text>

        <div className="space-y-4">
          <Button onClick={() => navigate('/')} icon="Home" variant="primary">
            Go to Dashboard
          </Button>

          <div className="text-sm text-surface-500">
            <Button onClick={() => navigate(-1)} variant="text">
              ← Go back to previous page
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;