import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../layouts/components/Sidebar";
import { LogOut, Menu, User } from "lucide-react";
import { useProfile } from "../api/profile/Profile";
import { useGetAssignedPermissions } from "../api/administrator/role/getAssignedPermission";
import { useDispatch, useSelector } from "react-redux";
import {
  setModules,
  setPermissions,
} from "../redux/store/slice/permissionSlice";
import { setUser } from "../redux/store/slice/userSlice";
import { Circles } from "react-loader-spinner";
import { useLogout } from "../hooks/useLogout";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSidebarReady, setIsSidebarReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useLogout();

  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user);

  const { data: profile, isLoading: profileLoading } = useProfile();
  const {
    data: permissions,
    isPending: permissionsPending,
    isError: permissionsError,
  } = useGetAssignedPermissions(loggedInUser?.role_detail?.id);

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
    if (permissions?.permissions && permissions?.modules) {
      dispatch(setPermissions(permissions.permissions));
      dispatch(setModules(permissions.modules));
    }

    if (profile && permissions && !profileLoading && !permissionsPending) {
      setIsSidebarReady(true);
    }
  }, [permissions, dispatch, profile, profileLoading, permissionsPending]);

  // Close dropdown when clicking Outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  if (profileLoading || permissionsPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Circles
          height="80"
          width="80"
          color="#2563eb"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  if (permissionsError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-[60px] flex items-center justify-between sticky top-0 z-30">
          {/* Hamburger – only visible when sidebar is closed */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
            aria-label="Toggle sidebar"
          >
            {!sidebarOpen && <Menu size={20} />}
          </button>

          {/* Profile dropdow */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl  transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 select-none overflow-hidden">
                {loggedInUser?.profile_image ? (
                  <img
                    src={loggedInUser.profile_image}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-1.5 z-50">
                {/* User info header */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {profile?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {profile?.email || ""}
                  </p>
                </div>

                {/* View Profile */}
                <button
                  onClick={() => {
                    navigate("/profile", { state: { profile } });
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  View profile
                </button>

                <div className="border-t border-slate-100 my-1.5" />

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  data-testid="logout-btn"
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="md:p-4 lg:p-6">
          {isSidebarReady ? (
            <Outlet />
          ) : (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
