import axios from "axios";

export const predictSkin = async (data) => {
  const res = await axios.post("http://localhost:5000/predict", data);
  return res.data;
};