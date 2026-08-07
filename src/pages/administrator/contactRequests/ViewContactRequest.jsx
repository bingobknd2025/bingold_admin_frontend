import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarClock,
  Globe,
  Hash,
  Mail,
  MessageSquare,
  Monitor,
  NotebookPen,
  RefreshCw,
  User,
  UserCheck,
} from "lucide-react";
import {
  useUpdateContactRequestStatus,
  useViewContactRequest,
} from "../../../api/administrator/contactRequests/contactRequests";
import SectionCard from "../../../components/common/SectionCard";
import InfoRow from "../../../components/common/InfoRow";
import StatusSelectModal from "../../../components/common/StatusSelectModal";
import ContactStatusPill, { STATUS_OPTIONS } from "./ContactStatusPill";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

const ViewContactRequest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const id = state?.item?.id;

  const { data, isLoading, isError, refetch } = useViewContactRequest(id);
  // Fall back to the row handed over by the list so the page paints instantly;
  // the fetched record replaces it (and carries the untruncated message).
  const request = data || state?.item;

  const { mutate: updateStatus, isPending } = useUpdateContactRequestStatus();
  const [statusModal, setStatusModal] = useState(false);

  const handleUpdateStatus = ({ value, note }) => {
    updateStatus(
      { id, status: value, admin_note: note },
      {
        onSuccess: () => {
          toast.success("Contact request updated!");
          setStatusModal(false);
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">
          No contact request selected.{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/admin/contact-requests/list")}
          >
            Back to the list
          </button>
        </p>
      </div>
    );
  }

  if (isLoading && !request) return <div className="p-6">Loading contact request...</div>;
  if (isError && !request) return <div className="p-6">Error loading contact request.</div>;
  if (!request) return null;

  const resolverName = request.resolver
    ? `${request.resolver.name} (${request.resolver.email})`
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/contact-requests/list")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Contact Requests
        </button>
        <button
          onClick={() => setStatusModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" /> Update Status
        </button>
      </div>

      <SectionCard
        icon={MessageSquare}
        title={request.subject || "Contact Request"}
        badge={<ContactStatusPill status={request.status} />}
      >
        <InfoRow label="Reference" value={request.ticket_ref} icon={Hash} />
        <InfoRow label="Name" value={request.name} icon={User} />
        <InfoRow
          label="Email"
          icon={Mail}
          value={
            request.email ? (
              <a
                className="text-blue-600 hover:underline"
                href={`mailto:${request.email}?subject=${encodeURIComponent(
                  `Re: ${request.subject || ""} [${request.ticket_ref || ""}]`,
                )}`}
              >
                {request.email}
              </a>
            ) : null
          }
        />
        <InfoRow label="Source" value={request.source} icon={Globe} />
        <InfoRow
          label="Received"
          value={formatDate(request.created_at)}
          icon={CalendarClock}
        />
      </SectionCard>

      <SectionCard icon={MessageSquare} title="Message">
        <div className="py-3">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {request.message}
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={NotebookPen} title="Handling">
        <InfoRow
          label="Internal note"
          value={
            request.admin_note ? (
              <span className="whitespace-pre-wrap break-words">
                {request.admin_note}
              </span>
            ) : null
          }
          fallback="No note yet"
        />
        <InfoRow
          label="Resolved / closed at"
          value={formatDate(request.resolved_at)}
          icon={CalendarClock}
          fallback="Not yet"
        />
        <InfoRow
          label="Handled by"
          value={resolverName}
          icon={UserCheck}
          fallback="Nobody yet"
        />
      </SectionCard>

      <SectionCard icon={Monitor} title="Submission Origin">
        <InfoRow label="IP address" value={request.ip_address} />
        <InfoRow
          label="User agent"
          value={
            request.user_agent ? (
              <span className="break-all">{request.user_agent}</span>
            ) : null
          }
        />
      </SectionCard>

      <StatusSelectModal
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        onConfirm={handleUpdateStatus}
        title="Update Contact Request"
        label="Status"
        options={STATUS_OPTIONS}
        initialValue={request.status || "NEW"}
        isLoading={isPending}
        noteLabel="Internal note (optional)"
      />
    </div>
  );
};

export default ViewContactRequest;
