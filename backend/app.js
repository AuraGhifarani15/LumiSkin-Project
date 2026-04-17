const express = require("express");
const cors = require("cors");
const { predictSkin } = require("./ai/predict");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend LumiSkin jalan 🚀");
});

// endpoint AI
app.post("/predict", (req, res) => {
  const data = req.body;

  console.log("DATA MASUK:", data);

  const result = predictSkin(data);

  console.log("HASIL AI:", result);

  res.json({
    message: "Data diproses AI",
    input: data,
    result: result
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});