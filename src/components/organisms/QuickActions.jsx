import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const QuickActions = ({ onNavigate }) => {
  const actions = [
    { title: 'New Patient', description: 'Register new admission', icon: 'UserPlus', path: '/patients', color: 'primary' },
    { title: 'Schedule', description: 'Book appointment', icon: 'Calendar', path: '/appointments', color: 'success' },
    { title: 'Bed Status', description: 'Check availability', icon: 'Bed', path: '/beds', color: 'info' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Button
          key={action.title}
          onClick={() => onNavigate(action.path)}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left"
          variant="none" // Use custom styling, not standard button variant
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${action.color === 'primary' ? 'bg-primary/10' :
                                             action.color === 'success' ? 'bg-success/10' :
                                             'bg-info/10'}`}>
              <ApperIcon name={action.icon} size={24} className={action.color === 'primary' ? 'text-primary' :
                                                               action.color === 'success' ? 'text-success' :
                                                               'text-info'} />
            </div>
            <div>
              <Text as="h3" className="font-semibold text-surface-900">{action.title}</Text>
              <Text as="p" className="text-sm text-surface-600">{action.description}</Text>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;