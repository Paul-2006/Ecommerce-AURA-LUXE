import { useEffect, useState } from "react";
import {
    getSellers,
    updateSellerApproval
} from "../../services/adminService";

function ManageSellers() {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        const response = await getSellers();
        setSellers(response.data);
    };

    const setStatus = async (sellerId, status) => {
        await updateSellerApproval({
            sellerId,
            status,
            remarks: `${status} by admin`
        });
        loadSellers();
    };

    return (
        <div className="container">
            <h1>Manage Sellers</h1>

            <table border="1" width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>Seller ID</th>
                        <th>Business</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Complaints</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sellers.map((seller) => (
                        <tr key={seller.sellerId}>
                            <td>{seller.sellerId}</td>
                            <td>{seller.businessName || "Not updated"}</td>
                            <td>{seller.email}</td>
                            <td>{seller.status || seller.approvalStatus}</td>
                            <td>{seller.complaintCount ?? 0}</td>
                            <td>
                                <button onClick={() => setStatus(seller.sellerId, "Approved")}>
                                    Approve
                                </button>
                                {" "}
                                <button onClick={() => setStatus(seller.sellerId, "Rejected")}>
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

export default ManageSellers;
