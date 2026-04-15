// src/components/common/FilterPanel.jsx

import React from 'react';

const FilterPanel = ({ config, filters, onFilterChange, onReset }) => {
  const handleChange = (name, value) => {
    onFilterChange(name, value);
  };

  const renderFilter = (filter) => {
    const value = filters[filter.name] ?? '';

    switch (filter.type) {
      case 'text':
      case 'number':
        return (
          <input
            key={filter.name}
            type={filter.type}
            placeholder={filter.placeholder || filter.label}
            value={value}
            onChange={(e) => handleChange(filter.name, e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        );

      case 'select':
        return (
          <select
            key={filter.name}
            value={value}
            onChange={(e) => handleChange(filter.name, e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {config.filters.map(renderFilter)}

        {/* Clear Button */}
        <button
          onClick={onReset}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;