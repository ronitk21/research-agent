import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import researchRouter from "./routes/research.route";
import "./workers/researchWorker";

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

app.use("/api/v1", researchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
