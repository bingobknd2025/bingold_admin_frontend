// src/config/filterConfigs.js

export const filterConfigs = {
  vehiclesList: {
    filters: [
      {
        name: "search",
        type: "text",
        label: "Search",
        placeholder: "Search vehicle...",
        debounce: 500,
        minLength: 3,
      },
      {
        name: "status",
        type: "select",
        label: "Status",
        placeholder: "All Status",
        options: [
          { value: "", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
      {
        name: "vehicle_type",
        type: "select",
        label: "Vehicle Type",
        placeholder: "All Types",
        options: [
          { value: "", label: "All Types" },
          { value: "truck", label: "Truck" },
          { value: "van", label: "Van" },
          { value: "bike", label: "Bike" },
          { value: "car", label: "Car" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "franchise_id",
        type: "number",
        label: "Franchise",
        placeholder: "Franchise ID",
      },
      {
        name: "sortBy",
        type: "select",
        label: "Sort By",
        options: [
          { value: "created_at", label: "Created At" },
          { value: "vehicle_number", label: "Vehicle No" },
          { value: "year_of_manufacture", label: "Year" },
        ],
      },
      {
        name: "sortOrder",
        type: "select",
        label: "Order",
        options: [
          { value: "DESC", label: "Newest" },
          { value: "ASC", label: "Oldest" },
        ],
      },
    ],
    defaultFilters: {
      status: "",
      vehicle_type: "",
      franchise_id: "",
      search: "",
      sortBy: "created_at",
      sortOrder: "DESC",
    },
  },
};
