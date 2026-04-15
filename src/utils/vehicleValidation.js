// ─── Constants ───────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;
const MAX_YEAR = CURRENT_YEAR + 1;

const VALID_VEHICLE_TYPES = ["truck", "van", "bike", "car", "other"];

// Indian vehicle registration: DL01AB1234 or DL01A1234
const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/;

// Letters, spaces, hyphens, dots — no leading/trailing spaces after trim
const NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\s\-\.]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;

// ─── Individual Field Validators ─────────────────────────────────────────────

const validateVehicleNumber = (value) => {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) return "Vehicle number is required";

  if (trimmed.length < 6) return "Vehicle number is too short";
  if (trimmed.length > 15) return "Vehicle number is too long";

  if (!/^[A-Z0-9]+$/.test(trimmed.toUpperCase().replace(/\s/g, "")))
    return "Vehicle number can only contain letters and numbers";

  if (!VEHICLE_NUMBER_REGEX.test(trimmed.toUpperCase()))
    return "Invalid format — expected format: DL01AB1234";

  return null;
};

const validateVehicleType = (value) => {
  if (!value || value === "") return "Please select a vehicle type";

  if (!VALID_VEHICLE_TYPES.includes(value))
    return "Invalid vehicle type selected";

  return null;
};

const validateModel = (value) => {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) return "Model is required";
  if (trimmed.length < 2) return "Model must be at least 2 characters";
  if (trimmed.length > 50) return "Model must not exceed 50 characters";

  if (!/^[a-zA-Z0-9][a-zA-Z0-9\s\-\/\.]*$/.test(trimmed))
    return "Model can only contain letters, numbers, spaces, hyphens, or dots";

  return null;
};

const validateManufacturer = (value) => {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) return "Manufacturer is required";
  if (trimmed.length < 2) return "Manufacturer must be at least 2 characters";
  if (trimmed.length > 50) return "Manufacturer must not exceed 50 characters";

  if (!/^[a-zA-Z][a-zA-Z\s\-\.]*$/.test(trimmed))
    return "Manufacturer can only contain letters, spaces, or hyphens";

  return null;
};

const validateYearOfManufacture = (value) => {
  if (value === "" || value === null || value === undefined)
    return "Year of manufacture is required";

  const yearStr = String(value).trim();

  if (!/^\d{4}$/.test(yearStr)) return "Year must be a valid 4-digit number";

  const year = parseInt(yearStr, 10);

  if (isNaN(year)) return "Year must be a valid number";
  if (year < MIN_YEAR) return `Year must not be before ${MIN_YEAR}`;
  if (year > MAX_YEAR) return `Year must not be after ${MAX_YEAR}`;

  return null;
};

// ─── Main Validator ───────────────────────────────────────────────────────────

export const validateVehicleForm = (formData) => {
  const errors = {};

  const vehicleNumberError = validateVehicleNumber(formData.vehicle_number);
  if (vehicleNumberError) errors.vehicle_number = vehicleNumberError;

  const vehicleTypeError = validateVehicleType(formData.vehicle_type);
  if (vehicleTypeError) errors.vehicle_type = vehicleTypeError;

  const modelError = validateModel(formData.model);
  if (modelError) errors.model = modelError;

  const manufacturerError = validateManufacturer(formData.manufacturer);
  if (manufacturerError) errors.manufacturer = manufacturerError;

  const yearError = validateYearOfManufacture(formData.year_of_manufacture);
  if (yearError) errors.year_of_manufacture = yearError;

  return errors;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export const formatVehiclePayload = (formData) => {
  return {
    ...formData,
    vehicle_number: formData.vehicle_number.trim().toUpperCase(),
    model: formData.model.trim(),
    manufacturer: formData.manufacturer.trim(),
    year_of_manufacture: parseInt(formData.year_of_manufacture, 10),
  };
};

// ─── Single Field Validator (for real-time/inline use) ────────────────────────

export const validateField = (name, value) => {
  switch (name) {
    case "vehicle_number":
      return validateVehicleNumber(value);
    case "vehicle_type":
      return validateVehicleType(value);
    case "model":
      return validateModel(value);
    case "manufacturer":
      return validateManufacturer(value);
    case "year_of_manufacture":
      return validateYearOfManufacture(value);
    default:
      return null;
  }
};
