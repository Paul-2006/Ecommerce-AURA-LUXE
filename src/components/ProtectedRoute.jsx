import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Require authentication
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If role restriction is specified, verify permission
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || "Customer";
    const userRoleId = Number(user.roleId);

    const isRoleAllowed = allowedRoles.some((r) => {
      if (typeof r === "number") return r === userRoleId;
      if (r.toLowerCase() === "admin" && (userRole.toLowerCase() === "admin" || userRoleId === 1)) return true;
      if (r.toLowerCase() === "seller" && (userRole.toLowerCase() === "seller" || userRoleId === 2)) return true;
      if (r.toLowerCase() === "warehouse" && (userRole.toLowerCase() === "warehouse" || userRoleId === 3)) return true;
      if (r.toLowerCase() === "delivery" && (userRole.toLowerCase() === "delivery" || userRoleId === 4)) return true;
      if (r.toLowerCase() === "customer" && (userRole.toLowerCase() === "customer" || userRoleId === 5)) return true;
      return r.toLowerCase() === userRole.toLowerCase();
    });

    if (!isRoleAllowed) {
      // Redirect to the user's permitted role dashboard
      if (userRoleId === 1 || userRole.toLowerCase() === "admin") return <Navigate to="/admin/dashboard" replace />;
      if (userRoleId === 2 || userRole.toLowerCase() === "seller") return <Navigate to="/seller/dashboard" replace />;
      if (userRoleId === 3 || userRole.toLowerCase() === "warehouse") return <Navigate to="/warehouse/dashboard" replace />;
      if (userRoleId === 4 || userRole.toLowerCase() === "delivery") return <Navigate to="/delivery/dashboard" replace />;
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;