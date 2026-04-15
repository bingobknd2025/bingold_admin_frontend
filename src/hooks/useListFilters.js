import { useState, useCallback, useMemo, useEffect } from "react";
import { filterConfigs } from "../config/filterConfigs";

export const useListFilters = (configKey) => {
  const config = filterConfigs[configKey];

  if (!config) {
    throw new Error(`Filter config '${configKey}' not found`);
  }

  const [filters, setFilters] = useState(config.defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(
    config.defaultFilters,
  );

  // ✅ Debounce ALL filters (not just search)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [filters]);

  // Update single filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset to defaults
  const resetFilters = useCallback(() => {
    setFilters(config.defaultFilters);
    setDebouncedFilters(config.defaultFilters);
  }, [config.defaultFilters]);

  // ✅ Use debouncedFilters for API calls
  const queryParams = useMemo(() => {
    return Object.fromEntries(
      Object.entries(debouncedFilters).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
  }, [debouncedFilters]); // ← Uses debounced version

  return {
    filters,
    queryParams, // ← For API (debounced)
    updateFilter,
    updateFilters,
    resetFilters,
    config,
  };
};
