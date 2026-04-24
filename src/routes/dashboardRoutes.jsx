import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../guards/ProtectedRoute";
import Security from "../pages/security/Security";
import Permissions from "../pages/administrator/permissions/Permissions";
import ViewPermission from "../pages/administrator/permissions/ViewPermission";
import EditPermission from "../pages/administrator/permissions/EditPermission";
import CreatePermission from "../pages/administrator/permissions/CreatePermission";
import ListAllRole from "../pages/administrator/role/ListAllRole";
import CreateRoles from "../pages/administrator/role/CreateRoles";
import EditRole from "../pages/administrator/role/EditRole";
import ViewRole from "../pages/administrator/role/ViewRole";
import ListUsers from "../pages/administrator/users/ListUsers";
import CreateUser from "../pages/administrator/users/CreateUser";
import ViewUser from "../pages/administrator/users/ViewUser";
import EditUser from "../pages/administrator/users/EditUser";
import Profile from "../pages/profile/Profile";
import ProfileEdit from "../pages/profile/ProfileEdit";
import AccessDenied from "../components/common/Accessdenied";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PageNotFound from "../components/common/PageNotFound";

// Blogs
import ListBlogs from "../pages/administrator/blogs/ListBlogs";
import BlogForm from "../pages/administrator/blogs/BlogForm";
import ViewBlog from "../pages/administrator/blogs/ViewBlog";

// News
import ListNewss from "../pages/administrator/news/ListNewss";
import NewsForm from "../pages/administrator/news/NewsForm";
import ViewNews from "../pages/administrator/news/ViewNews";

// Youtube
import ListYoutubes from "../pages/administrator/youtube/ListYoutubes";
import YoutubeForm from "../pages/administrator/youtube/YoutubeForm";
import ViewYoutube from "../pages/administrator/youtube/ViewYoutube";

const dashboardRoutes = (
  <Route
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    {/* Dashboard */}
    <Route path="/dashboard" element={<DashboardPage />} />

    {/* Profile */}
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/edit" element={<ProfileEdit />} />
    <Route path="/security" element={<Security />} />

    {/* ================= PERMISSIONS ================= */}
    <Route path="/admin/permissions/list" element={<Permissions />} />
    <Route path="/admin/permissions/view" element={<ViewPermission />} />
    <Route path="/admin/permissions/edit" element={<EditPermission />} />
    <Route path="/admin/permissions/create" element={<CreatePermission />} />

    {/* ================= ROLES ================= */}
    <Route path="/admin/roles/list" element={<ListAllRole />} />
    <Route path="/admin/roles/create" element={<CreateRoles />} />
    <Route path="/admin/roles/edit" element={<EditRole />} />
    <Route path="/admin/roles/view" element={<ViewRole />} />

    {/* ================= USERS ================= */}
    <Route path="/admin/users/list" element={<ListUsers />} />
    <Route path="/admin/users/create" element={<CreateUser />} />
    <Route path="/admin/users/view" element={<ViewUser />} />
    <Route path="/admin/users/edit" element={<EditUser />} />

    {/* ================= BLOGS ================= */}
    <Route path="/admin/blogs/list" element={<ListBlogs />} />
    <Route path="/admin/blogs/create" element={<BlogForm />} />
    <Route path="/admin/blogs/edit" element={<BlogForm />} />
    <Route path="/admin/blogs/view" element={<ViewBlog />} />

    {/* ================= NEWS ================= */}
    <Route path="/admin/news/list" element={<ListNewss />} />
    <Route path="/admin/news/create" element={<NewsForm />} />
    <Route path="/admin/news/edit" element={<NewsForm />} />
    <Route path="/admin/news/view" element={<ViewNews />} />

    {/* ================= YOUTUBE ================= */}
    <Route path="/admin/youtube/list" element={<ListYoutubes />} />
    <Route path="/admin/youtube/create" element={<YoutubeForm />} />
    <Route path="/admin/youtube/edit" element={<YoutubeForm />} />
    <Route path="/admin/youtube/view" element={<ViewYoutube />} />

    {/* ================= SYSTEM ================= */}
    <Route path="/admin/access-denied" element={<AccessDenied />} />
    <Route path="*" element={<PageNotFound />} />
  </Route>
);

export default dashboardRoutes;
