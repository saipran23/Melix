import express from "express";
import {
  getAllUsers,
  getUserById,
  getAllTags,
  getAllCategories
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/admin", getAllUsers);
router.get("/:userId", getUserById);
router.get("/tags", getAllTags);
router.get("/categories", getAllCategories);

export default router;