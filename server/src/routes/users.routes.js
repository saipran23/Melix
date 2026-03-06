import express from "express";
import {
  getAllUsers,
  getUserById,
  getAllTags,
  getAllCategories,
  getMe,
  updateProfileImage,
  removeProfileImage,
  updateProfile
} from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/admin", getAllUsers);
router.get("/me", requireAuth, getMe);
router.get("/:userId", requireAuth, getUserById);
router.get("/tags", getAllTags);
router.get("/categories", getAllCategories);

router.patch(
  "/:userId/profile-picture",
  requireAuth,
  upload.single("profile_image"),
  updateProfileImage,
);

router.patch("/:userId/profile", requireAuth, updateProfile);

router.patch("/:userId/remove-profile-picture", requireAuth, removeProfileImage);

export default router;
