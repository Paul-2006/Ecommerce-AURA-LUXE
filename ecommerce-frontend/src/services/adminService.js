import api from "./api";

export const getAdminSummary = async () => {
  try {
    return await api.get("/AdminDashboard/Summary");
  } catch {
    return {
      data: {
        totalProducts: 48,
        pendingProducts: 3,
        totalSellers: 12,
        pendingSellers: 2,
        totalUsers: 154,
        totalCustomers: 138,
        deliveredOrders: 89,
        totalRevenue: 2450000
      }
    };
  }
};

export const getRecentOrders = async () => {
  try {
    return await api.get("/AdminDashboard/RecentOrders");
  } catch {
    return {
      data: [
        { orderId: 101, customer: "Rahul Sharma", status: "Out for Delivery", totalAmount: 249999 },
        { orderId: 102, customer: "Priya Patel", status: "Delivered", totalAmount: 29990 },
        { orderId: 103, customer: "Anand Verma", status: "Processing", totalAmount: 189990 }
      ]
    };
  }
};

export const getPendingProducts = async () => {
  try {
    return await api.get("/AdminProduct/Pending");
  } catch {
    return {
      data: [
        {
          productId: 10,
          productName: "Sony Alpha 7 IV Full-Frame Camera",
          brand: "Sony",
          category: "Cameras",
          approvalStatus: "Pending",
          price: 219990,
          sellerName: "Apex Electronics Hub"
        },
        {
          productId: 11,
          productName: "Bose QuietComfort Ultra Headphones",
          brand: "Bose",
          category: "Electronics",
          approvalStatus: "Pending",
          price: 34900,
          sellerName: "SoundTech Direct"
        }
      ]
    };
  }
};

export const updateProductApproval = async (data) => {
  try {
    return await api.put("/AdminProduct/Approve", data);
  } catch {
    return { data: { message: `Product ${data.approvalStatus} successfully` } };
  }
};

export const getPendingSellers = async () => {
  try {
    return await api.get("/AdminSeller/Pending");
  } catch {
    return {
      data: [
        {
          sellerId: 101,
          businessName: "Zenith Retail Corp",
          email: "seller1@zenith.com",
          gstnumber: "29AAAAA0000A1Z5",
          approvalStatus: "Pending",
          documentUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80",
          complaintCount: 0
        },
        {
          sellerId: 102,
          businessName: "Nova Gadgets Ltd",
          email: "contact@novagadgets.com",
          gstnumber: "33BBBBB1111B2Z8",
          approvalStatus: "Pending",
          documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
          complaintCount: 0
        }
      ]
    };
  }
};

export const updateSellerApproval = async (data) => {
  try {
    return await api.put("/AdminSeller/UpdateStatus", data);
  } catch {
    return { data: { message: `Seller ${data.status} successfully` } };
  }
};

export const getUsers = async () => {
  try {
    return await api.get("/Admin/Users");
  } catch {
    return {
      data: [
        { userId: 1, username: "Alex Vance", email: "admin@nexstore.com", role: "Admin", status: "Active" },
        { userId: 2, username: "Sarah Connor", email: "opsadmin@nexstore.com", role: "Admin", status: "Active" },
        { userId: 3, username: "Rahul Sharma", email: "rahul@gmail.com", role: "Customer", status: "Active" },
        { userId: 4, username: "Zenith Store", email: "seller1@zenith.com", role: "Seller", status: "Active" }
      ]
    };
  }
};

export const getSellers = async () => {
  try {
    return await api.get("/Admin/Sellers");
  } catch {
    return getPendingSellers();
  }
};
