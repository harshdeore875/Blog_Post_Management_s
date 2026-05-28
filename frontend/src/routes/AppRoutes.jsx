import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import RoleRedirect from '../components/common/RoleRedirect.jsx';
import AddBlog from '../pages/AddBlog.jsx';
import AdminBlogManagement from '../pages/admin/AdminBlogManagement.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import AuthorDashboard from '../pages/author/AuthorDashboard.jsx';
import MyBlogs from '../pages/author/MyBlogs.jsx';
import BlogList from '../pages/BlogList.jsx';
import EditBlog from '../pages/EditBlog.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Profile from '../pages/Profile.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';
import ViewBlog from '../pages/ViewBlog.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute allowedRoles={['user', 'author', 'admin']} />}>
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/view/:id" element={<ViewBlog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/blogs" element={<AdminBlogManagement />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['author']} />}>
        <Route path="/author/dashboard" element={<AuthorDashboard />} />
        <Route path="/author/blogs" element={<MyBlogs />} />
        <Route path="/author/blogs/create" element={<AddBlog />} />
        <Route path="/author/blogs/edit/:id" element={<EditBlog />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin', 'author']} />}>
        <Route path="/blog/add" element={<AddBlog />} />
        <Route path="/blog/edit/:id" element={<EditBlog />} />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
