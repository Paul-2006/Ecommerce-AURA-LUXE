import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getSellerProducts,
    updateSellerProduct
} from "../../services/sellerService";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [listing, setListing] = useState({
        sellerId: user.sellerId,
        productId: "",
        price: "",
        stockQuantity: ""
    });

    useEffect(() => {
        load();
    }, [id]);

    const load = async () => {
        const response = await getSellerProducts(user.sellerId);
        const product = response.data.find((item) => item.sellerProductId === Number(id));

        if (product) {
            setListing({
                sellerId: user.sellerId,
                productId: product.productId,
                price: product.price,
                stockQuantity: product.stock
            });
        }
    };

    const handle = (event) => {
        setListing({
            ...listing,
            [event.target.name]: event.target.value
        });
    };

    const save = async (event) => {
        event.preventDefault();
        await updateSellerProduct(id, {
            ...listing,
            price: Number(listing.price),
            stockQuantity: Number(listing.stockQuantity)
        });
        alert("Stock updated");
        navigate("/seller/products");
    };

    return (
        <div className="container">
            <h1>Edit Stock</h1>
            <form onSubmit={save}>
                <input name="price" type="number" step="0.01" value={listing.price} onChange={handle} />
                <br /><br />
                <input name="stockQuantity" type="number" value={listing.stockQuantity} onChange={handle} />
                <br /><br />
                <button>Update Stock</button>
            </form>
        </div>
    );
}

export default EditProduct;
