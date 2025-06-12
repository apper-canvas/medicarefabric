import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const DepartmentAnalytics = ({ departmentStats, totalPatients, getDepartmentTrend }) => {
  return (
    <Card className="rounded-none shadow-none p-0">
      <div className="p-6 border-b border-surface-200">
        <Text as="h2" className="text-lg font-semibold text-surface-900">Department Analytics</Text>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(departmentStats).map(([department, count], index) => {
            const trend = getDepartmentTrend(department);
            const percentage = totalPatients > 0
              ? Math.round((count / totalPatients) * 100)
              : 0;

            return (
              <Card
                key={department}
                className="bg-surface-50 rounded-lg p-4"
                motionProps={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: index * 0.1 }
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Text as="h3" className="font-medium text-surface-900">{department}</Text>
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
                    <Text as="p" className="text-2xl font-bold text-surface-900">{count}</Text>
                    <Text as="p" className="text-xs text-surface-600">patients ({percentage}%)</Text>
                  </div>
                  <div className="w-16 h-8 bg-primary/20 rounded">
                    <div
                      className="bg-primary rounded h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DepartmentAnalytics;