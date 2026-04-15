import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Newspaper,
  LayoutDashboard,
  ShieldCheck,
  Shield,
  UserCog,
  UsersRound,
  KeyRound,
  X,
  ChevronDown,
} from "lucide-react";
import { useLogout } from "../../hooks/useLogout";
import { useSelector } from "react-redux";

// ── SidebarDropdown ───────────────────────────────────────
const SidebarDropdown = ({
  icon: Icon,
  label,
  isActiveRoute,
  children,
  maxHeight = "max-h-56",
}) => {
  const [open, setOpen] = useState(isActiveRoute);

  useEffect(() => {
    if (isActiveRoute) setOpen(true);
  }, [isActiveRoute]);

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
          ${isActiveRoute && !open
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          {label}
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`ml-4 border-l-2 border-slate-700 pl-4 overflow-hidden transition-all duration-300 ease-in-out
          ${open ? `${maxHeight} opacity-100 mt-1` : "max-h-0 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────
export const Sidebar = ({ isOpen, onClose, profile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const reduxModule = useSelector((state) => state.permission.modules);

  const hasModule = (moduleName) =>
    reduxModule?.some((m) => m.toLowerCase() === moduleName.toLowerCase());

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
    ${isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"}`;

  const isLinkActive = (path) => location.pathname.startsWith(path);

  const customLinkClass = (basePath) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
    ${isLinkActive(basePath) ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Header ── */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">BINGOLD ADMIN</h1>
            <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          <nav className="space-y-1">
            {/* Dashboard */}
            {hasModule("Dashboard") && (
              <NavLink to="/dashboard" className={linkClass} end>
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
            )}

            {/* Blogs */}
            {hasModule("Blog") && (
              <NavLink to="/admin/blogs/list" className={customLinkClass("/admin/blogs")}>
                <FileText size={20} /> Manage Blogs
              </NavLink>
            )}

            {/* News */}
            {hasModule("News") && (
              <NavLink to="/admin/news/list" className={customLinkClass("/admin/news")}>
                <Newspaper size={20} /> Manage News
              </NavLink>
            )}

            {/* Security */}
            <NavLink to="/security" className={linkClass}>
              <ShieldCheck size={20} /> Security
            </NavLink>

            {/* Administrator Panel */}
            {(hasModule("User") ||
              hasModule("Role") ||
              hasModule("Permission")) && (
                <SidebarDropdown
                  icon={Shield}
                  label="Administrator Panel"
                  isActiveRoute={
                    isLinkActive("/admin/users") ||
                    isLinkActive("/admin/roles") ||
                    isLinkActive("/admin/permissions")
                  }
                  maxHeight="max-h-72"
                >
                  {hasModule("User") && (
                    <NavLink
                      to="/admin/users/list"
                      className={customLinkClass("/admin/users")}
                    >
                      <UserCog size={18} /> Manage User
                    </NavLink>
                  )}
                  {hasModule("Role") && (
                    <NavLink
                      to="/admin/roles/list"
                      className={customLinkClass("/admin/roles")}
                    >
                      <UsersRound size={18} /> Manage Role
                    </NavLink>
                  )}
                  {hasModule("Permission") && (
                    <NavLink
                      to="/admin/permissions/list"
                      className={customLinkClass("/admin/permissions")}
                    >
                      <KeyRound size={18} /> Manage Permission
                    </NavLink>
                  )}
                </SidebarDropdown>
              )}
          </nav>
        </div>
      </aside>
    </>
  );
};
