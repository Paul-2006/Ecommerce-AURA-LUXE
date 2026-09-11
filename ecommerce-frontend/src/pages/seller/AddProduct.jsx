import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { addProduct, addSellerProduct, uploadProductImage } from "../../services/sellerService";
import { ArrowLeft, Upload, CheckCircle2, AlertTriangle, RefreshCw, Save } from "lucide-react";
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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const validateForm = () => {
    if (!product.productName.trim() || product.productName.trim().length < 3) {
      return "Product title must be at least 3 characters long.";
    }
    if (!product.brand.trim()) {
      return "Brand name is required.";
    }
    if (!product.description.trim() || product.description.trim().length < 10) {
      return "Description must be at least 10 characters long.";
    }
    if (!sellerListing.price || Number(sellerListing.price) <= 0) {
      return "Selling price must be greater than 0.";
    }
    if (sellerListing.stockQuantity === "" || Number(sellerListing.stockQuantity) < 0) {
      return "Stock quantity cannot be negative.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      return;
    }

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

      setSuccessMsg("Product submitted successfully! Sent to Admin console for catalog clearance.");
      setTimeout(() => navigate("/seller/products"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save product listing. Please check API connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header flex justify-between items-center mb-6">
        <div>
          <h1 className="seller-page-title">Add New Product Listing</h1>
          <p className="seller-page-subtitle">
            List high-grade products for customer discovery across our marketplace catalog
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigate("/seller/products")}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Products
        </button>
      </div>

      {errorMsg && (
        <div className="seller-alert seller-alert-danger mb-4">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="seller-alert seller-alert-success mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="seller-card" style={{ maxWidth: "840px" }}>
        <div className="seller-card-header">
          <h3 className="seller-card-title">Product Specification Form</h3>
        </div>
        <div className="seller-card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="seller-grid seller-grid-2 gap-4">
              <div>
                <label className="seller-form-label">Product Title *</label>
                <input
                  type="text"
                  name="productName"
                  className="seller-form-input"
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  value={product.productName}
                  onChange={handleProductChange}
                  required
                />
              </div>

              <div>
                <label className="seller-form-label">Brand Name *</label>
                <input
                  type="text"
                  name="brand"
                  className="seller-form-input"
                  placeholder="e.g. Sony"
                  value={product.brand}
                  onChange={handleProductChange}
                  required
                />
              </div>
            </div>

            <div className="seller-grid seller-grid-3 gap-4">
              <div>
                <label className="seller-form-label">Category *</label>
                <select
                  name="categoryId"
                  className="seller-form-input"
                  value={product.categoryId}
                  onChange={handleProductChange}
                >
                  <option value={1}>Electronics / Audio</option>
                  <option value={2}>Laptops & Computers</option>
                  <option value={3}>Smartphones & Mobile</option>
                  <option value={4}>Accessories & Wearables</option>
                </select>
              </div>

              <div>
                <label className="seller-form-label">Selling Price (INR ₹) *</label>
                <input
                  type="number"
                  name="price"
                  min="1"
                  className="seller-form-input"
                  placeholder="e.g. 29990"
                  value={sellerListing.price}
                  onChange={handleListingChange}
                  required
                />
              </div>

              <div>
                <label className="seller-form-label">Initial Stock Units *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  className="seller-form-input"
                  placeholder="e.g. 25"
                  value={sellerListing.stockQuantity}
                  onChange={handleListingChange}
                  required
                />
              </div>
            </div>

            <div className="seller-grid seller-grid-2 gap-4">
              <div>
                <label className="seller-form-label">SKU Code</label>
                <input
                  type="text"
                  name="sku"
                  className="seller-form-input"
                  value={product.sku}
                  onChange={handleProductChange}
                />
              </div>

              <div>
                <label className="seller-form-label">Warranty Terms</label>
                <input
                  type="text"
                  name="warranty"
                  className="seller-form-input"
                  value={product.warranty}
                  onChange={handleProductChange}
                />
              </div>
            </div>

            <div>
              <label className="seller-form-label">Full Product Description *</label>
              <textarea
                name="description"
                rows="4"
                className="seller-form-textarea"
                placeholder="Provide detailed technical specifications, model highlights, and box contents..."
                value={product.description}
                onChange={handleProductChange}
                required
              />
            </div>

            <div>
              <label className="seller-form-label">Product Showcase Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/seller/products")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" aria-hidden="true" />
                    <span>Submit Product Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
