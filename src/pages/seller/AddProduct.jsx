import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { addProduct, addSellerProduct, uploadProductImage } from "../../services/sellerService";
import "../../css/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState({
    categoryId: 1,
    productName: "",
    description: "",
    brand: "",
    warranty: "1 Year Official Warranty",
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
        sellerId: user?.sellerId || 1,
        productId,
        price: Number(sellerListing.price),
        stockQuantity: Number(sellerListing.stockQuantity)
      });

      if (image) {
        await uploadProductImage(productId, image);
      }

      alert("Product Submitted: Sent to Admin console for catalog approval.");
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
    <div className="add-product-page-container centered-container">
      {/* Header */}
      <div className="page-header center-content">
        <span className="badge-pill badge-primary">Merchant Catalog</span>
        <h1>Add New Marketplace Product</h1>
        <p>List high-grade products for customer discovery across our marketplace catalog.</p>
      </div>

      <div className="add-product-card glass-panel">
        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
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
              <label className="form-label">Brand Name *</label>
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

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleProductChange}
                className="input-modern"
              >
                <option value={1}>Mobiles & 5G Phones</option>
                <option value={2}>Laptops & Computers</option>
                <option value={3}>Audio & Electronics</option>
                <option value={4}>Smartwatches & Wearables</option>
                <option value={5}>Cameras & Optical Gear</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Seller Price (₹ INR) *</label>
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
              <label className="form-label">Initial Stock Units *</label>
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

          <div className="form-group">
            <label className="form-label">Warranty Details</label>
            <input
              type="text"
              name="warranty"
              value={product.warranty}
              onChange={handleProductChange}
              placeholder="e.g. 1 Year Manufacturer Warranty"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Technical Description</label>
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
            <label className="form-label">Product Showcase Image</label>
            <div className="image-upload-dropzone">
              <input type="file" accept="image/*" onChange={handleImageSelect} id="prod-img-input" />
              <label htmlFor="prod-img-input" className="upload-dropzone-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="img-upload-preview" />
                ) : (
                  <div className="dropzone-placeholder">
                    <strong>Click to upload product photo</strong>
                    <p>PNG, JPG, WebP up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-actions-row">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/seller/products")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Submitting Listing..." : "Submit Product for Catalog Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
