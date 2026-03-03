import express from "express";
import {
  getAllUsers,
  getUserById,
  getAllTags,
  getAllCategories,
  getMe
} from "../controllers/users.controller.js";
import {requireAuth} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin", getAllUsers);
router.get("/me",requireAuth, getMe);
router.get("/:userId",requireAuth, getUserById);
router.get("/tags", getAllTags);
router.get("/categories", getAllCategories);

export default router;