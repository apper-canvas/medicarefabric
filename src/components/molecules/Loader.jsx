import React from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';

const Loader = ({ count = 1, type = 'card', className = '' }) => {
  const renderCardLoader = (i) => (
    <Card key={i} className="animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
        <div className="h-8 bg-surface-200 rounded w-1/2"></div>
        <div className="h-3 bg-surface-200 rounded w-2/3"></div>
      </div>
    </Card>
  );

  const renderListLoader = (i) => (
    <Card key={i} className="animate-pulse p-4">
      <div className="space-y-3">
        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
        <div className="h-3 bg-surface-200 rounded w-1/2"></div>
        <div className="h-3 bg-surface-200 rounded w-2/3"></div>
      </div>
    </Card>
  );

  const renderDetailLoader = () => (
    <Card className="animate-pulse space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-surface-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-surface-200 rounded w-48"></div>
          <div className="h-4 bg-surface-200 rounded w-32"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-6 bg-surface-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (type === 'detail') {
    return <div className={`p-6 ${className}`}>{renderDetailLoader()}</div>;
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-surface-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-surface-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className={`${type === 'card' ? 'grid grid-cols-1 md:grid-cols-4 gap-6' : 'space-y-4'}`}>
        {[...Array(count)].map((_, i) => (
          type === 'card' ? renderCardLoader(i) : renderListLoader(i)
        ))}
      </div>
    </div>
  );
};

export default Loader;