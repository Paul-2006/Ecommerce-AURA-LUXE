import { useEffect, useState } from "react";
import { getUsers } from "../../services/adminService";
import "../../css/Dashboard.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsersList();
  }, []);

  const loadUsersList = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-users-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Registered Platform Accounts & Roles</h1>
          <p>Audit customer, seller, warehouse manager, and delivery partner credentials.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>User Directory ({users.length} Accounts)</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadUsersList}>
            Refresh List
          </button>
        </div>

        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username / Name</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId}>
                    <td><strong>#USR-00{u.userId}</strong></td>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge-pill ${u.role === "Admin" ? "badge-danger" : u.role === "Seller" ? "badge-warning" : u.role === "Delivery" ? "badge-success" : "badge-primary"}`}>
                        {u.role || "Customer"}
                      </span>
                    </td>
                    <td><span className="badge-pill badge-success">Active</span></td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => alert(`Auditing permissions for user "${u.username}"`)}
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
