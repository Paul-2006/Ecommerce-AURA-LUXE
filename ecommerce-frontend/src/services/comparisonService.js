import api from "./api";

export const compareProducts = (data) => {
    return api.post("/ProductComparison/Compare", data);
};
