import { useEffect, useState } from "react";
import {
    getAssignedDeliveries,
    updateDeliveryLocation,
    updateDeliveryStatus
} from "../../services/deliveryService";

function AssignedDeliveries() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        if (!user.deliveryPartnerId) {
            return;
        }

        try {
            const response = await getAssignedDeliveries(user.deliveryPartnerId);
            setDeliveries(response.data);
        }
        catch (error) {
            console.log(error);
            alert("Unable to load assigned deliveries");
        }
    };

    const setStatus = async (assignmentId, status) => {
        await updateDeliveryStatus(assignmentId, status);
        loadDeliveries();
    };

    const sendGps = async (orderId) => {
        if (!navigator.geolocation) {
            alert("GPS is not available in this browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await updateDeliveryLocation({
                    deliveryPartnerId: user.deliveryPartnerId,
                    orderId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                alert("Location updated");
            },
            () => alert("Unable to read GPS location")
        );
    };

    return (
        <div className="container">
            <h1>Assigned Deliveries</h1>

            <table border="1" width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries.map((item) => (
                        <tr key={item.assignmentId}>
                            <td>{item.orderId}</td>
                            <td>Rs. {item.totalAmount}</td>
                            <td>{item.status}</td>
                            <td>
                                <button onClick={() => setStatus(item.assignmentId, "Out For Delivery")}>
                                    Out For Delivery
                                </button>
                                {" "}
                                <button onClick={() => sendGps(item.orderId)}>
                                    Send GPS
                                </button>
                                {" "}
                                <button onClick={() => setStatus(item.assignmentId, "Delivered")}>
                                    Delivered
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssignedDeliveries;
