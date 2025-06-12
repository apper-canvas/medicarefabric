import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({
  title,
  value,
  iconName,
  iconColorClass, // e.g., 'text-primary'
  bgColorClass,   // e.g., 'bg-primary/10'
  changeText,
  changeType, // 'positive', 'negative', 'neutral'
  delay = 0,
  className = ''
}) => {
  const changeColorClass = changeType === 'positive' ? 'text-success' :
                           changeType === 'negative' ? 'text-error' :
                           'text-surface-500';

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 ${className}`}
      motionProps={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: delay },
        whileHover: { y: -2 }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Text as="p" className="text-sm font-medium text-surface-600">{title}</Text>
          <Text as="p" className="text-2xl font-bold text-surface-900 mt-1">{value}</Text>
          {changeText && (
            <Text as="p" className={`text-xs mt-1 ${changeColorClass}`}>{changeText}</Text>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColorClass}`}>
          <ApperIcon name={iconName} size={24} className={iconColorClass} />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;