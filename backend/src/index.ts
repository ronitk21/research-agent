import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: "true",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
