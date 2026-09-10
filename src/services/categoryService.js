import api from "./api";

const DEMO_CATEGORIES = [
  { categoryId: 1, categoryName: "Mobiles", iconKey: "Smartphone", description: "Smartphones, 5G devices and accessories" },
  { categoryId: 2, categoryName: "Laptops", iconKey: "Laptop", description: "Gaming laptops, ultrabooks, MacBooks" },
  { categoryId: 3, categoryName: "Electronics", iconKey: "Headphones", description: "Audio, smart TV, gaming consoles" },
  { categoryId: 4, categoryName: "Accessories", iconKey: "Watch", description: "Smartwatches, mice, keyboards, chargers" },
  { categoryId: 5, categoryName: "Cameras", iconKey: "Camera", description: "DSLR, Mirrorless, 4K action cameras" }
];

export const getCategories = async () => {
  try {
    const res = await api.get("/Category");
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (err) {
    console.warn("Backend getCategories failed, using catalog categories:", err.message);
  }
  return DEMO_CATEGORIES;
};

export const getCategory = async (id) => {
  try {
    const res = await api.get(`/Category/${id}`);
    return res.data;
  } catch {
    return DEMO_CATEGORIES.find((c) => c.categoryId === Number(id)) || DEMO_CATEGORIES[0];
  }
};
