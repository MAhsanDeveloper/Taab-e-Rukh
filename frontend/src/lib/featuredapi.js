import axios from "./axios";

export const fetchFeaturedByCategory = async (category) => {
  const res = await axios.get(`/shop/featured/${category}`);
  return res.data;
};
