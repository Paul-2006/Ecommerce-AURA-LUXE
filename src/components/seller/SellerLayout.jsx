import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SellerSidebar from "./SellerSidebar";
import SellerTopbar from "./SellerTopbar";
import "../../css/SellerPortal.css";

function SellerLayout({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication check
  if (!token || !user) {
    return <Navigate to="/seller/login" replace />;
  }

  // Role authorization check (Role ID 2 or Role "Seller")
  if (user.role !== "Seller" && user.roleId !== 2) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="seller-portal-wrapper">
      <SellerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="seller-main-container">
        <SellerTopbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="seller-portal-content">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default SellerLayout;
