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

// Agents
import ListAgents from "../pages/administrator/agents/ListAgents";
import AgentForm from "../pages/administrator/agents/AgentForm";
import ViewAgent from "../pages/administrator/agents/ViewAgent";

// Investor Registrations (investor-ui signup capture)
import ListInvestorRegistrations from "../pages/administrator/investorRegistrations/ListInvestorRegistrations";
import ViewInvestorRegistration from "../pages/administrator/investorRegistrations/ViewInvestorRegistration";

// Contact Requests (public contact-us form)
import ListContactRequests from "../pages/administrator/contactRequests/ListContactRequests";
import ViewContactRequest from "../pages/administrator/contactRequests/ViewContactRequest";

// BingoPay - Users
import ListBingopayUsers from "../pages/administrator/bingopay/users/ListBingopayUsers";
import ViewBingopayUser from "../pages/administrator/bingopay/users/ViewBingopayUser";

// BingoPay - Vendors
import ListVendors from "../pages/administrator/bingopay/vendors/ListVendors";
import VendorForm from "../pages/administrator/bingopay/vendors/VendorForm";
import ViewVendor from "../pages/administrator/bingopay/vendors/ViewVendor";

// BingoPay - QR
import ListQrCodes from "../pages/administrator/bingopay/qr/ListQrCodes";
import QrForm from "../pages/administrator/bingopay/qr/QrForm";
import ViewQrCode from "../pages/administrator/bingopay/qr/ViewQrCode";

// BingoPay - Payments
import ListPayments from "../pages/administrator/bingopay/payments/ListPayments";
import ViewPayment from "../pages/administrator/bingopay/payments/ViewPayment";

// BingoPay - Settlements
import ListSettlements from "../pages/administrator/bingopay/settlements/ListSettlements";
import SettlementForm from "../pages/administrator/bingopay/settlements/SettlementForm";
import ViewSettlement from "../pages/administrator/bingopay/settlements/ViewSettlement";

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

    {/* ================= AGENTS ================= */}
    <Route path="/admin/agents/list" element={<ListAgents />} />
    <Route path="/admin/agents/create" element={<AgentForm />} />
    <Route path="/admin/agents/edit" element={<AgentForm />} />
    <Route path="/admin/agents/view" element={<ViewAgent />} />

    {/* ========= INVESTOR REGISTRATIONS ========= */}
    <Route path="/admin/investor-registrations/list" element={<ListInvestorRegistrations />} />
    <Route path="/admin/investor-registrations/view" element={<ViewInvestorRegistration />} />

    {/* ============ CONTACT REQUESTS ============ */}
    <Route path="/admin/contact-requests/list" element={<ListContactRequests />} />
    <Route path="/admin/contact-requests/view" element={<ViewContactRequest />} />

    {/* ============ BINGOPAY - USERS ============ */}
    <Route path="/admin/bingopay/users/list" element={<ListBingopayUsers />} />
    <Route path="/admin/bingopay/users/view" element={<ViewBingopayUser />} />

    {/* ============ BINGOPAY - VENDORS ============ */}
    <Route path="/admin/bingopay/vendors/list" element={<ListVendors />} />
    <Route path="/admin/bingopay/vendors/create" element={<VendorForm />} />
    <Route path="/admin/bingopay/vendors/edit" element={<VendorForm />} />
    <Route path="/admin/bingopay/vendors/view" element={<ViewVendor />} />

    {/* ============ BINGOPAY - QR ============ */}
    <Route path="/admin/bingopay/qr/list" element={<ListQrCodes />} />
    <Route path="/admin/bingopay/qr/create" element={<QrForm />} />
    <Route path="/admin/bingopay/qr/view" element={<ViewQrCode />} />

    {/* ============ BINGOPAY - PAYMENTS ============ */}
    <Route path="/admin/bingopay/payments/list" element={<ListPayments />} />
    <Route path="/admin/bingopay/payments/view" element={<ViewPayment />} />

    {/* ============ BINGOPAY - SETTLEMENTS ============ */}
    <Route path="/admin/bingopay/settlements/list" element={<ListSettlements />} />
    <Route path="/admin/bingopay/settlements/create" element={<SettlementForm />} />
    <Route path="/admin/bingopay/settlements/view" element={<ViewSettlement />} />

    {/* ================= SYSTEM ================= */}
    <Route path="/admin/access-denied" element={<AccessDenied />} />
    <Route path="*" element={<PageNotFound />} />
  </Route>
);

export default dashboardRoutes;
