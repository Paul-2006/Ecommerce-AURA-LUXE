import { useNavigate } from "react-router-dom";
import "../../css/Dashboard.css";

function DeliveryDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h1>Delivery Partner Dashboard</h1>
            <p>Manage assigned deliveries, location updates and customer OTP verification</p>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Assigned Orders</h2>
                    <p>View delivery orders assigned to you</p>
                    <button onClick={() => navigate("/delivery/assigned")}>View Orders</button>
                </div>

                <div className="dashboard-card">
                    <h2>Live Tracking</h2>
                    <p>Send GPS coordinates while on delivery</p>
                    <button onClick={() => navigate("/delivery/assigned")}>Track Location</button>
                </div>

                <div className="dashboard-card">
                    <h2>Delivery OTP</h2>
                    <p>Verify customer delivery OTP</p>
                    <button onClick={() => navigate("/delivery/otp")}>Verify OTP</button>
                </div>

                <div className="dashboard-card">
                    <h2>Delivery Status</h2>
                    <p>Update assignment status</p>
                    <button onClick={() => navigate("/delivery/assigned")}>Update Status</button>
                </div>
            </div>
        </div>
    );
}

export default DeliveryDashboard;
