import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  Check,
  FileText,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import {
  useViewVendor,
  useVendorKycDocuments,
  useApproveVendor,
  useRejectVendor,
  useChangeVendorStatus,
  useInitiateVendorKyc,
  useSubmitVendorKyc,
  useReviewKycDocument,
} from "../../../../api/administrator/bingopay/vendors";
import SectionCard from "../../../../components/common/SectionCard";
import InfoRow from "../../../../components/common/InfoRow";
import StatusBadge from "../../../../components/common/StatusBadge";
import StatusSelectModal from "../../../../components/common/StatusSelectModal";

const VENDOR_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected", label: "Rejected" },
];

const fmt = (v) => (v ? new Date(v).toLocaleString() : "N/A");

const ViewVendor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id || location.state?.item?.id;

  const { data: vendor, isLoading, refetch } = useViewVendor(id);
  const { data: documents, refetch: refetchDocs } = useVendorKycDocuments(id);

  const { mutate: approveVendor } = useApproveVendor();
  const { mutate: rejectVendor, isPending: isRejecting } = useRejectVendor();
  const { mutate: changeStatus, isPending: isChanging } = useChangeVendorStatus();
  const { mutate: initiateKyc, isPending: isInitiating } = useInitiateVendorKyc();
  const { mutate: submitKyc, isPending: isSubmitting } = useSubmitVendorKyc();
  const { mutate: reviewDoc } = useReviewKycDocument();

  const [statusModal, setStatusModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);

  if (isLoading) return <div className="p-6">Loading vendor...</div>;
  if (!vendor) return <div className="p-6">No data available.</div>;

  const handleApprove = () => {
    if (!window.confirm("Approve this vendor?")) return;
    approveVendor(vendor.id, {
      onSuccess: () => {
        toast.success("Vendor approved!");
        refetch();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error approving vendor"),
    });
  };

  const handleReject = ({ note }) => {
    rejectVendor(
      { id: vendor.id, reason: note },
      {
        onSuccess: () => {
          toast.success("Vendor rejected!");
          setRejectModal(false);
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error rejecting vendor"),
      },
    );
  };

  const handleChangeStatus = ({ value }) => {
    changeStatus(
      { id: vendor.id, status: value },
      {
        onSuccess: () => {
          toast.success("Vendor status updated!");
          setStatusModal(false);
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  const handleInitiateKyc = () => {
    initiateKyc(vendor.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "KYC initiated. Applicant created.");
        refetch();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error initiating KYC"),
    });
  };

  const handleSubmitKyc = (e) => {
    e.preventDefault();
    if (!docFile) {
      toast.error("Please choose a document file");
      return;
    }
    const fd = new FormData();
    fd.append("vendor_id", vendor.id);
    if (docType.trim()) fd.append("document_type", docType.trim());
    fd.append("file", docFile);
    submitKyc(fd, {
      onSuccess: () => {
        toast.success("KYC document submitted!");
        setDocType("");
        setDocFile(null);
        refetchDocs();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error submitting document"),
    });
  };

  const handleReviewDoc = (documentId, status) => {
    reviewDoc(
      { document_id: documentId, status },
      {
        onSuccess: () => {
          toast.success(`Document ${status}`);
          refetchDocs();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error reviewing document"),
      },
    );
  };

  const docList = Array.isArray(documents) ? documents : documents?.data || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Vendor Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleApprove}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
        >
          <Check size={16} /> Approve
        </button>
        <button
          onClick={() => setRejectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          <XCircle size={16} /> Reject
        </button>
        <button
          onClick={() => setStatusModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
        >
          <ShieldCheck size={16} /> Change Status
        </button>
        <button
          onClick={handleInitiateKyc}
          disabled={isInitiating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
        >
          <ShieldCheck size={16} /> {isInitiating ? "Initiating..." : "Initiate Online KYC"}
        </button>
      </div>

      <SectionCard
        icon={Building2}
        title={vendor.business_name || "Vendor"}
        badge={<StatusBadge status={vendor.status} />}
      >
        <InfoRow label="ID" value={vendor.id} />
        <InfoRow label="User ID" value={vendor.user_id} />
        <InfoRow label="Business Name" value={vendor.business_name} />
        <InfoRow label="Business Type" value={vendor.business_type} />
        <InfoRow label="GST Number" value={vendor.gst_number} />
        <InfoRow label="PAN Number" value={vendor.pan_number} />
        <InfoRow label="Website" value={vendor.website} />
        <InfoRow label="Address" value={vendor.address} />
        <InfoRow label="Annual Turnover" value={vendor.annual_turnover} />
        <InfoRow
          label="KYC Status"
          value={<StatusBadge status={vendor.kyc_status} />}
        />
        <InfoRow label="Status" value={<StatusBadge status={vendor.status} />} />
        <InfoRow label="Created At" value={fmt(vendor.created_at)} />
        <InfoRow label="Updated At" value={fmt(vendor.updated_at)} />
      </SectionCard>

      {/* KYC Documents */}
      <SectionCard icon={FileText} title="Offline KYC Documents">
        <form
          onSubmit={handleSubmitKyc}
          className="flex flex-wrap items-end gap-3 py-4 border-b border-gray-100"
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Document Type</label>
            <input
              type="text"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              placeholder="e.g. gst_certificate"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">File</label>
            <input
              type="file"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            <Upload size={16} /> {isSubmitting ? "Uploading..." : "Submit"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docList.length > 0 ? (
                docList.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{doc.document_type || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      {doc.file_url || doc.url ? (
                        <a
                          href={doc.file_url || doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3">
                        <button
                          className="text-emerald-600 hover:text-emerald-800"
                          onClick={() => handleReviewDoc(doc.id, "approved")}
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleReviewDoc(doc.id, "rejected")}
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
                    No KYC documents uploaded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <StatusSelectModal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        onConfirm={handleChangeStatus}
        title="Change Vendor Status"
        options={VENDOR_STATUS}
        initialValue={vendor.status}
        isLoading={isChanging}
      />
      <StatusSelectModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Vendor"
        label="Action"
        options={[{ value: "rejected", label: "Reject" }]}
        initialValue="rejected"
        noteLabel="Reason"
        isLoading={isRejecting}
      />
    </div>
  );
};

export default ViewVendor;
