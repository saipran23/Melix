import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
dotenv.config();  
import express from "express";
import app from "./app.js";
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});