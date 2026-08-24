import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Link as LinkIcon,
  Mail,
  MailCheck,
  Network,
  Phone,
  Receipt,
  ShieldCheck,
  Tag,
  User,
  X,
} from "lucide-react";
import { useViewInvestorRegistration } from "../../../api/administrator/investorRegistrations/investorRegistrations";
import SectionCard from "../../../components/common/SectionCard";
import InfoRow from "../../../components/common/InfoRow";
import RegistrationStatusPill from "./RegistrationStatusPill";

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

// Stored as a plain YYYY-MM-DD date, so render it without timezone shifting.
const formatDateOnly = (value) =>
  value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" },
      )
    : null;

// Values are stored as slugs (private_limited) — show them as words.
const formatEntityType = (value) =>
  value
    ? String(value)
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : null;

const withProtocol = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

/**
 * A consent, rendered as given / not given.
 *
 * Absent is shown as "Not given" rather than left blank: a registration
 * captured before the consent checkboxes shipped genuinely has no consent on
 * record, and that is the honest reading of it.
 */
const ConsentValue = ({ given, at, notGivenLabel = "Not given" }) =>
  given ? (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <Check className="h-3 w-3" />
        Given
      </span>
      {at && <span className="text-xs text-gray-500">{formatDate(at)}</span>}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
      <X className="h-3 w-3" />
      {notGivenLabel}
    </span>
  );

const formatSize = (bytes) => {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ViewInvestorRegistration = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const id = state?.item?.id;

  const { data, isLoading, isError } = useViewInvestorRegistration(id);
  const registration = data || state?.item;

  if (!id) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">
          No registration selected.{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/admin/investor-registrations/list")}
          >
            Back to the list
          </button>
        </p>
      </div>
    );
  }

  if (isLoading) return <div className="p-6">Loading registration...</div>;
  if (isError && !registration)
    return <div className="p-6">Error loading registration.</div>;

  const documents = registration?.documents || [];
  const fullName =
    [registration?.first_name, registration?.last_name]
      .filter(Boolean)
      .join(" ") || null;

  // The consent audit trail — the address it was given from and the exact
  // wording on screen at the time — rides in meta.consent rather than in its
  // own columns. Older rows have no meta at all.
  const consent = registration?.meta?.consent || {};
  const consentIp = consent.ip || null;
  const consentText = consent.text || null;
  const consentVersion = registration?.consent_version || consent.version || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/investor-registrations/list")}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Investor Registrations
        </button>
        <RegistrationStatusPill status={registration?.status} />
      </div>

      <SectionCard
        icon={registration?.account_type === "company" ? Building2 : User}
        title={fullName || registration?.email || "Investor Registration"}
        badge={
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              registration?.account_type === "company"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {registration?.account_type}
          </span>
        }
      >
        <InfoRow label="Full Name" value={fullName} icon={User} />
        <InfoRow label="Email" value={registration?.email} icon={Mail} />
        <InfoRow label="Phone" value={registration?.phone} icon={Phone} />
        <InfoRow label="Country" value={registration?.country} icon={Globe} />
        <InfoRow label="Referral Code" value={registration?.ref_code} icon={Tag} />
        <InfoRow label="Source" value={registration?.source} />
        <InfoRow
          label="Signed Up"
          value={formatDate(registration?.created_at)}
          icon={Calendar}
        />
        <InfoRow
          label="Documents Submitted"
          value={formatDate(registration?.documents_submitted_at)}
          icon={Calendar}
        />
      </SectionCard>

      {/* What this user agreed to at signup, and when. Shown for every account
          type — the consents are collected on the signup form itself, not on
          the company step. */}
      <SectionCard
        icon={ShieldCheck}
        title="Consents"
        badge={
          consentVersion ? (
            <span className="text-xs text-gray-500">
              Version {consentVersion}
            </span>
          ) : null
        }
      >
        <InfoRow
          label="Terms & Privacy Policy"
          icon={ShieldCheck}
          value={
            <ConsentValue
              given={Boolean(registration?.terms_accepted)}
              at={registration?.terms_accepted_at}
              notGivenLabel="Not on record"
            />
          }
        />
        <InfoRow
          label="Marketing Emails"
          icon={MailCheck}
          value={
            <ConsentValue
              given={Boolean(registration?.marketing_opt_in)}
              at={registration?.marketing_opt_in_at}
              notGivenLabel="Opted out"
            />
          }
        />
        {consentIp && (
          <InfoRow label="Consent IP" value={consentIp} icon={Network} />
        )}
        {consentText?.terms && (
          <InfoRow
            label="Terms Wording Shown"
            value={
              <span className="font-normal text-gray-600">
                {consentText.terms}
              </span>
            }
          />
        )}
        {consentText?.marketing && (
          <InfoRow
            label="Marketing Wording Shown"
            value={
              <span className="font-normal text-gray-600">
                {consentText.marketing}
              </span>
            }
          />
        )}
      </SectionCard>

      {registration?.account_type === "company" && (
        <SectionCard icon={Building2} title="Company Details">
          <InfoRow
            label="Legal Company Name"
            value={registration?.legal_company_name}
            icon={Building2}
          />
          <InfoRow label="Trading Name / DBA" value={registration?.trading_name} />
          <InfoRow
            label="Legal Entity Type"
            value={formatEntityType(registration?.legal_entity_type)}
          />
          <InfoRow
            label="Country of Incorporation"
            value={registration?.country_of_incorporation}
            icon={Globe}
          />
          <InfoRow
            label="Registration Number"
            value={registration?.registration_number}
            icon={Hash}
          />
          <InfoRow
            label="Tax Identification Number"
            value={registration?.tax_identification_number}
            icon={Receipt}
          />
          <InfoRow
            label="Date of Incorporation"
            value={formatDateOnly(registration?.date_of_incorporation)}
            icon={Calendar}
          />
          <InfoRow
            label="Industry"
            value={formatEntityType(registration?.industry)}
            icon={Briefcase}
          />
          <InfoRow
            label="Company Website"
            value={
              registration?.company_website ? (
                <a
                  href={withProtocol(registration.company_website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {registration.company_website}
                </a>
              ) : null
            }
            icon={LinkIcon}
          />
          <InfoRow
            label="Business Description"
            value={registration?.business_description}
          />
        </SectionCard>
      )}

      {registration?.account_type === "company" && (
        <SectionCard
          icon={FileText}
          title="Company Documents"
          badge={
            <span className="text-xs text-gray-500">
              {documents.length} attached
            </span>
          }
        >
          {documents.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">
              This company has not uploaded its registration documents yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 py-4">
              {documents.map((doc) => (
                <div
                  key={doc.public_id || doc.doc_type}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {doc.label || doc.doc_type}
                    </span>
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                  <span className="text-xs text-gray-500 break-all">
                    {doc.file_name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {formatSize(doc.size) && <span>{formatSize(doc.size)}</span>}
                    {doc.uploaded_at && <span>{formatDate(doc.uploaded_at)}</span>}
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Open document
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

export default ViewInvestorRegistration;
