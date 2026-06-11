import { useCallback } from "react";
import AsyncSelect from "react-select/async";
import api from "../../utils/axios";

// Searchable vendor picker backed by the BingoPay vendors list endpoint.
// value: vendor id (number) | "" ; onChange(id, vendorObject)
const toOption = (v) => ({
  value: v.id,
  label: `${v.business_name || "Vendor"} (#${v.id})`,
  vendor: v,
});

const VendorSelect = ({
  value,
  selectedVendor,
  onChange,
  placeholder = "Search vendor by name...",
  hasError = false,
}) => {
  const loadOptions = useCallback(async (inputValue) => {
    const { data } = await api.post("/admin/bingopay/vendors/list", {
      page: 1,
      limit: 20,
      ...(inputValue && { search: inputValue }),
    });
    const list = data?.data?.data || data?.data || [];
    return list.map(toOption);
  }, []);

  // Build the controlled value object react-select expects.
  let currentValue = null;
  if (selectedVendor) currentValue = toOption(selectedVendor);
  else if (value)
    currentValue = { value, label: `Vendor #${value}`, vendor: { id: value } };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable
      value={currentValue}
      loadOptions={loadOptions}
      placeholder={placeholder}
      onChange={(opt) => onChange(opt?.value ?? "", opt?.vendor ?? null)}
      noOptionsMessage={() => "No vendors found"}
      classNamePrefix="vendor-select"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: hasError ? "#ef4444" : base.borderColor,
          borderRadius: "0.5rem",
          padding: "1px",
          minHeight: "42px",
        }),
        menu: (base) => ({ ...base, zIndex: 30 }),
      }}
    />
  );
};

export default VendorSelect;
