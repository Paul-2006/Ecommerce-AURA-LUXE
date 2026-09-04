import { useState } from "react";
import {
    generateDeliveryOtp,
    verifyDeliveryOtp
} from "../../services/deliveryService";

function DeliveryOTP() {
    const [orderId, setOrderId] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");

    const generate = async () => {
        try {
            const response = await generateDeliveryOtp(orderId);
            setGeneratedOtp(response.data.otp);
            alert("OTP generated for customer");
        }
        catch (error) {
            console.log(error);
            alert("Unable to generate OTP");
        }
    };

    const verify = async () => {
        try {
            await verifyDeliveryOtp({
                orderId: Number(orderId),
                otp
            });
            alert("Delivery verified successfully");
        }
        catch (error) {
            console.log(error);
            alert("Invalid OTP");
        }
    };

    return (
        <div className="container">
            <h1>Delivery OTP Verification</h1>

            <input
                placeholder="Order ID"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
            />
            <br /><br />

            <button onClick={generate}>Generate OTP</button>

            {generatedOtp && (
                <p>Customer OTP: {generatedOtp}</p>
            )}

            <br /><br />

            <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
            />
            <br /><br />

            <button onClick={verify}>Verify OTP</button>
        </div>
    );
}

export default DeliveryOTP;
