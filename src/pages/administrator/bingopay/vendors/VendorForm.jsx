import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useCreateVendor,
  useUpdateVendor,
} from "../../../../api/administrator/bingopay/vendors";

const VendorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const isEditing = !!item;

  const [formData, setFormData] = useState(() => ({
    user_id: item?.user_id || "",
    email: item?.email || "",
    phone: item?.phone || "",
    business_name: item?.business_name || "",
    business_type: item?.business_type || "",
    gst_number: item?.gst_number || "",
    pan_number: item?.pan_number || "",
    address: item?.address || "",
    website: item?.website || "",
    annual_turnover: item?.annual_turnover ?? "",
  }));
  const [errors, setErrors] = useState({});

  const { mutate: createVendor, isPending: isCreating } = useCreateVendor();
  const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.business_name.trim())
      e.business_name = "Business name is required";
    if (!isEditing && !formData.user_id && !formData.email && !formData.phone)
      e.user_id = "Provide a user_id OR email/phone";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted errors");
      return;
    }

    if (isEditing) {
      const payload = {
        id: item.id,
        business_name: formData.business_name.trim(),
        business_type: formData.business_type.trim() || undefined,
        gst_number: formData.gst_number.trim() || undefined,
        pan_number: formData.pan_number.trim() || undefined,
        address: formData.address.trim() || undefined,
        website: formData.website.trim() || undefined,
      };
      updateVendor(payload, {
        onSuccess: () => {
          toast.success("Vendor updated successfully!");
          navigate("/admin/bingopay/vendors/list");
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating vendor"),
      });
    } else {
      const payload = {
        ...(formData.user_id && { user_id: Number(formData.user_id) }),
        ...(formData.email && { email: formData.email.trim() }),
        ...(formData.phone && { phone: formData.phone.trim() }),
        business_name: formData.business_name.trim(),
        ...(formData.business_type && { business_type: formData.business_type.trim() }),
        ...(formData.gst_number && { gst_number: formData.gst_number.trim() }),
        ...(formData.pan_number && { pan_number: formData.pan_number.trim() }),
        ...(formData.address && { address: formData.address.trim() }),
        ...(formData.website && { website: formData.website.trim() }),
        ...(formData.annual_turnover !== "" && {
          annual_turnover: Number(formData.annual_turnover),
        }),
      };
      createVendor(payload, {
        onSuccess: () => {
          toast.success("Vendor onboarded successfully!");
          navigate("/admin/bingopay/vendors/list");
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error onboarding vendor"),
      });
    }
  };

  const errorClass = (f) => (errors[f] ? "border-red-500" : "");
  const inputClass = (f) => `w-full border rounded-lg p-2 ${errorClass(f)}`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? "Edit Vendor" : "Onboard Vendor"}
      </h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
      >
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className={inputClass("user_id")}
              />
              {errors.user_id && <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass("email")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass("phone")} />
            </div>
            <p className="md:col-span-3 text-xs text-gray-500 -mt-3">
              Provide an existing User ID, or an email/phone to link the vendor account.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} className={inputClass("business_name")} />
            {errors.business_name && <p className="mt-1 text-xs text-red-600">{errors.business_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <input type="text" name="business_type" value={formData.business_type} onChange={handleChange} className={inputClass("business_type")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className={inputClass("gst_number")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} className={inputClass("pan_number")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input type="text" name="website" value={formData.website} onChange={handleChange} className={inputClass("website")} />
          </div>
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Turnover</label>
              <input type="number" name="annual_turnover" value={formData.annual_turnover} onChange={handleChange} className={inputClass("annual_turnover")} />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputClass("address")} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreating || isUpdating ? "Saving..." : "Save Vendor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorForm;
