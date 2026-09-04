import { useEffect, useState } from "react";
import { getPendingProducts, updateProductApproval } from "../../services/adminService";
import { getProducts } from "../../services/productService";
import "../../css/Dashboard.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const pendingRes = await getPendingProducts();
      if (pendingRes.data && pendingRes.data.length > 0) {
        setProducts(pendingRes.data);
      } else {
        const all = await getProducts();
        setProducts(all);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (productId, status) => {
    await updateProductApproval({
      productId,
      adminId: 1,
      approvalStatus: status,
      remarks: `${status} by Admin Console`
    });

    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, approvalStatus: status } : p))
    );
    alert(`Product #${productId} marked as ${status}.`);
  };

  return (
    <div className="manage-products-container centered-container">
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Product Catalog Approval Center</h1>
          <p>Review new merchant product submissions, verify specifications, and grant catalog clearance.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", marginTop: "24px" }}>
        <div className="table-header-bar">
          <h3>Catalog Submissions Review</h3>
          <button className="btn btn-secondary btn-sm" onClick={loadProducts}>
            Refresh List
          </button>
        </div>

        {loading ? (
          <p>Loading products for approval...</p>
        ) : (
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Brand & Category</th>
                  <th>Seller</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId}>
                    <td><strong>#{p.productId}</strong></td>
                    <td><strong>{p.productName}</strong></td>
                    <td>
                      <div>
                        <span>{p.brand || "Brand"}</span> • <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{p.category || "Electronics"}</span>
                      </div>
                    </td>
                    <td>{p.sellerName || "Zenith Retail Corp"}</td>
                    <td>
                      <span className={`badge-pill ${p.approvalStatus === "Approved" ? "badge-success" : p.approvalStatus === "Rejected" ? "badge-danger" : "badge-warning"}`}>
                        {p.approvalStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproval(p.productId, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApproval(p.productId, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
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

export default ManageProducts;
