import React from 'react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  autoFocus = false
}) => {
  return (
    <div className="sticky top-0 z-10 p-2" style={{
      background: 'rgba(255, 255, 255, 0.30)',
      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.30) inset, 0 0.5px 0 0 #FFF inset, 0 0 0.5px 0 rgba(0, 0, 0, 0.15)'
    }}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          className="w-full px-3 py-1 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {value && (
          <button
            onClick={() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
