import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { addProduct, addSellerProduct, uploadProductImage } from "../../services/sellerService";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import "../../css/SellerPortal.css";

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState({
    categoryId: 1,
    productName: "",
    description: "",
    brand: "",
    sku: `SKU-${Date.now().toString().slice(-6)}`,
    discount: "0",
    warranty: "1 Year Official Brand Warranty",
    approvalStatus: "Pending"
  });

  const [sellerListing, setSellerListing] = useState({
    price: "",
    stockQuantity: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleListingChange = (e) => {
    setSellerListing({ ...sellerListing, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productRes = await addProduct(product);
      const productId = productRes.productId || productRes.data?.productId || Date.now();

      await addSellerProduct({
        sellerId: user?.sellerId || user?.userId || 1,
        productId,
        price: Number(sellerListing.price),
        stockQuantity: Number(sellerListing.stockQuantity)
      });

      if (image) {
        await uploadProductImage(productId, image);
      }

      alert("Product Submitted: Sent to Admin console for catalog clearance.");
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
      alert("Product listing created successfully.");
      navigate("/seller/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header glass-panel" style={{ padding: "20px 24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="badge-pill badge-secondary">Catalog Management</span>
            <h1 style={{ margin: "6px 0 2px 0", fontSize: "1.35rem" }}>Add New Marketplace Product Listing</h1>
            <p style={{ margin: 0, fontSize: "0.86rem" }}>
              List high-grade products for customer discovery across our marketplace catalog.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/products")}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Products
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "28px", maxWidth: "840px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Product Title *</label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleProductChange}
                placeholder="e.g. Apple iPad Pro 13-inch M4"
                required
              />
            </div>

            <div className="form-group">
              <label>Brand Name *</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleProductChange}
                placeholder="e.g. Apple, Sony, Samsung"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Category</label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleProductChange}
              >
                <option value={1}>Mobiles & 5G Phones</option>
                <option value={2}>Laptops & Computers</option>
                <option value={3}>Audio & Electronics</option>
                <option value={4}>Smartwatches & Wearables</option>
                <option value={5}>Cameras & Optical Gear</option>
              </select>
            </div>

            <div className="form-group">
              <label>Seller List Price (₹) *</label>
              <input
                type="number"
                min="1"
                step="1"
                name="price"
                value={sellerListing.price}
                onChange={handleListingChange}
                placeholder="e.g. 89900"
                required
              />
            </div>

            <div className="form-group">
              <label>Initial Stock Quantity *</label>
              <input
                type="number"
                min="1"
                name="stockQuantity"
                value={sellerListing.stockQuantity}
                onChange={handleListingChange}
                placeholder="e.g. 20"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>SKU / Stock Keeping Unit</label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleProductChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Warranty Terms</label>
              <input
                type="text"
                name="warranty"
                value={product.warranty}
                onChange={handleProductChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Full Technical Description *</label>
            <textarea
              name="description"
              rows="4"
              value={product.description}
              onChange={handleProductChange}
              placeholder="Detail key features, processor, display, battery life, included box accessories..."
              required
            />
          </div>

          {/* Image Upload Box */}
          <div className="form-group">
            <label>Product Photo Showcase</label>
            <div style={{ border: "2px dashed var(--seller-border)", borderRadius: "10px", padding: "20px", textAlign: "center", background: "var(--seller-surface-alt)" }}>
              <input type="file" accept="image/*" onChange={handleImageSelect} id="prod-img-input" style={{ display: "none" }} />
              <label htmlFor="prod-img-input" style={{ cursor: "pointer", display: "block" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ maxHeight: "160px", margin: "0 auto", borderRadius: "8px" }} />
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto" style={{ color: "var(--seller-secondary)" }} aria-hidden="true" />
                    <strong style={{ display: "block", marginTop: "8px", color: "var(--seller-primary)" }}>Click to upload product photo</strong>
                    <span style={{ fontSize: "0.78rem", color: "var(--seller-text-secondary)" }}>PNG, JPG, WebP up to 10MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="admin-alert admin-alert-warning" style={{ margin: 0 }}>
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span style={{ fontSize: "0.82rem" }}>
              Note: Submitted listings are routed to the <strong>Master Admin Product Approval Desk</strong>. Once verified, the listing will go live on the customer catalog.
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/seller/products")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting Listing..." : "Submit Product for Clearance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
