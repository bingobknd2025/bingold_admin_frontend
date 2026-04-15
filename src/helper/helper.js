export const formatStatus = (s) => s?.replaceAll("_", " ");

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

export const formatDateOnly = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

export const isExpired = (d) => d && new Date(d) < new Date();

export const isExpiringSoon = (d) => {
  if (!d) return false;
  const diff = new Date(d) - new Date();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
};
