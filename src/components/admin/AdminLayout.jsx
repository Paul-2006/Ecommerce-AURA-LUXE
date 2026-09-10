import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../../css/AdminPortal.css";

function AdminLayout({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication check
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Role authorization check (Role ID 1 or Role "Admin")
  if (user.role !== "Admin" && user.roleId !== 1) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-portal-wrapper">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="admin-main-container">
        <AdminTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        
        <main className="admin-portal-content">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
