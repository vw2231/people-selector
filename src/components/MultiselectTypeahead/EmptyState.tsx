import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="px-4 py-4 text-center">
      <div className="text-gray-700 font-medium mb-1">No results found</div>
      <div className="text-gray-500 text-sm">
        It looks like your search is a bit too specific. Try adjusting or resetting your search to see more results.
      </div>
    </div>
  );
};
