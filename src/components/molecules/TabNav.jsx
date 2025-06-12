import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const TabNav = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <nav className={`flex space-x-8 px-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          {tab.icon && <ApperIcon name={tab.icon} size={16} />}
          <Text as="span">{tab.label}</Text>
        </button>
      ))}
    </nav>
  );
};

export default TabNav;