import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Authentication check
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Role authorization check (Role ID 1 or Role "Admin")
  if (user.role !== "Admin" && user.roleId !== 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-portal-wrapper" style={{ minHeight: "100vh", background: "var(--bg-main, #0b0f17)", color: "var(--text-main, #f8fafc)" }}>
      <AdminNavbar />
      <main className="admin-portal-main-content" style={{ padding: "24px 0 48px 0" }}>
        {children ? children : <Outlet />}
      </main>
    </div>
  );
}

export default AdminLayout;
