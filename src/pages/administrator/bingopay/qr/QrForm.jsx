import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateQrCode } from "../../../../api/administrator/bingopay/qr";
import VendorSelect from "../../../../components/common/VendorSelect";

const QrForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendor_id: "",
    qr_type: "static",
    amount: "",
    coin: "BIGOD",
    label: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedVendor, setSelectedVendor] = useState(null);

  const { mutate: createQr, isPending } = useCreateQrCode();

  const handleVendorChange = (id, vendor) => {
    setFormData((prev) => ({ ...prev, vendor_id: id }));
    setSelectedVendor(vendor);
    setErrors((prev) => ({ ...prev, vendor_id: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.vendor_id) newErrors.vendor_id = "Vendor ID is required";
    if (formData.qr_type === "dynamic" && !formData.amount)
      newErrors.amount = "Amount is required for dynamic QR";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted errors");
      return;
    }

    const payload = {
      vendor_id: Number(formData.vendor_id),
      qr_type: formData.qr_type,
      ...(formData.amount !== "" && { amount: Number(formData.amount) }),
      ...(formData.coin && { coin: formData.coin.trim() }),
      ...(formData.label && { label: formData.label.trim() }),
    };

    createQr(payload, {
      onSuccess: () => {
        toast.success("QR created successfully!");
        navigate("/admin/bingopay/qr/list");
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error creating QR"),
    });
  };

  const errorClass = (f) => (errors[f] ? "border-red-500" : "");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Create Payment QR</h2>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
            <VendorSelect
              value={formData.vendor_id}
              selectedVendor={selectedVendor}
              onChange={handleVendorChange}
              hasError={!!errors.vendor_id}
            />
            {errors.vendor_id && <p className="mt-1 text-xs text-red-600">{errors.vendor_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Type</label>
            <select
              name="qr_type"
              value={formData.qr_type}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option value="static">Static</option>
              <option value="dynamic">Dynamic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${errorClass("amount")}`}
            />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coin</label>
            <input
              type="text"
              name="coin"
              value={formData.coin}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {isPending ? "Saving..." : "Create QR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QrForm;
