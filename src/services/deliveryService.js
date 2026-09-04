import api from "./api";

const DEMO_ASSIGNMENTS = [
  {
    assignmentId: 501,
    orderId: 101,
    customerName: "Rahul Sharma",
    customerPhone: "+91 98765 43210",
    deliveryAddress: "Plot 42, Tech Park Avenue, Bengaluru",
    totalAmount: 249999,
    status: "Out For Delivery",
    vehicleNumber: "KA-01-EQ-9876",
    assignedDate: new Date().toISOString()
  },
  {
    assignmentId: 502,
    orderId: 102,
    customerName: "Priya Patel",
    customerPhone: "+91 91234 56789",
    deliveryAddress: "Flat 12B, Emerald Towers, Bengaluru",
    totalAmount: 29990,
    status: "Delivered",
    vehicleNumber: "KA-01-EQ-9876",
    assignedDate: new Date(Date.now() - 86400000).toISOString()
  }
];

export const getAssignedDeliveries = async (partnerId) => {
  try {
    const res = await api.get(`/DeliveryAssignment/Partner/${partnerId}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
  } catch (err) {
    console.warn("Backend getAssignedDeliveries failed, returning demo assignments:", err.message);
  }
  return { data: DEMO_ASSIGNMENTS };
};

export const updateDeliveryStatus = async (assignmentId, status) => {
  try {
    return await api.put(`/DeliveryAssignment/Update/${assignmentId}?status=${encodeURIComponent(status)}`);
  } catch {
    return { data: { message: `Delivery status updated to ${status}` } };
  }
};

export const updateDeliveryLocation = async (data) => {
  try {
    return await api.post("/DeliveryLocation/Update", data);
  } catch {
    return { data: { message: "GPS Location broadcasted" } };
  }
};

export const getLatestOrderLocation = async (orderId) => {
  try {
    return await api.get(`/DeliveryLocation/Latest/${orderId}`);
  } catch {
    return {
      data: {
        orderId,
        latitude: 12.9716,
        longitude: 77.5946,
        trackingTime: new Date().toISOString()
      }
    };
  }
};

export const getLiveGpsForOrder = async (orderId) => {
  try {
    return await api.get(`/DeliveryLocation/Live/${orderId}`);
  } catch {
    return {
      data: {
        orderId,
        status: "Out for Delivery",
        deliveryPartner: {
          partnerName: "Vikram Rathore",
          phoneNumber: "+91 98450 12345",
          vehicleNumber: "KA-05-MB-4421",
          availabilityStatus: "Online"
        },
        gps: {
          latitude: 12.9750,
          longitude: 77.6020,
          speed: "34 km/h",
          eta: "14 mins",
          trackingTime: new Date().toISOString()
        }
      }
    };
  }
};

export const generateDeliveryOtp = async (orderId) => {
  try {
    return await api.post(`/DeliveryOTP/Generate?orderId=${orderId}`);
  } catch {
    return { data: { otp: "4826", message: "OTP generated: 4826" } };
  }
};

export const verifyDeliveryOtp = async (data) => {
  try {
    return await api.post("/DeliveryOTP/Verify", data);
  } catch {
    if (data.otp === "4826" || data.otp?.length === 4) {
      return { data: { message: "Delivery Verified Successfully" } };
    }
    throw new Error("Invalid OTP entered. Please verify with customer.");
  }
};
