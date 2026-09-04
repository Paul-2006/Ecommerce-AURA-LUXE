import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteSellerProduct,
    getSellerProducts
} from "../../services/sellerService";

function MyProducts() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        if (!user.sellerId) {
            return;
        }

        try {
            const response = await getSellerProducts(user.sellerId);
            setProducts(response.data);
        }
        catch (error) {
            console.log(error);
            alert("Unable to load products");
        }
    };

    const removeProduct = async (id) => {
        if (!window.confirm("Remove this stock listing?")) {
            return;
        }

        try {
            await deleteSellerProduct(id);
            loadProducts();
        }
        catch {
            alert("Delete failed");
        }
    };

    return (
        <div className="container">
            <h1>My Products</h1>
            <button onClick={() => navigate("/seller/add-product")}>Add New Product</button>
            <br /><br />

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Listing ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.sellerProductId}>
                            <td>{product.sellerProductId}</td>
                            <td>{product.productName}</td>
                            <td>Rs. {product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => navigate(`/seller/edit-product/${product.sellerProductId}`)}>
                                    Edit Stock
                                </button>
                                {" "}
                                <button onClick={() => removeProduct(product.sellerProductId)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyProducts;
