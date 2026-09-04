import { useEffect, useState } from "react";
import {
    getPendingProducts,
    updateProductApproval
} from "../../services/adminService";
import { getProducts } from "../../services/productService";

function ManageProducts() {
    const admin = JSON.parse(localStorage.getItem("user") || "{}");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const pending = await getPendingProducts();
            if (pending.data.length > 0) {
                setProducts(pending.data);
                return;
            }

            const allProducts = await getProducts();
            setProducts(allProducts);
        }
        catch (error) {
            console.log(error);
        }
    };

    const setApproval = async (productId, approvalStatus) => {
        await updateProductApproval({
            productId,
            adminId: admin.userId || 1,
            approvalStatus,
            remarks: `${approvalStatus} by admin`
        });
        loadProducts();
    };

    return (
        <div className="container">
            <h1>Manage Products</h1>

            <table border="1" width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>{product.brand}</td>
                            <td>{product.approvalStatus}</td>
                            <td>
                                <button onClick={() => setApproval(product.productId, "Approved")}>
                                    Approve
                                </button>
                                {" "}
                                <button onClick={() => setApproval(product.productId, "Rejected")}>
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageProducts;
