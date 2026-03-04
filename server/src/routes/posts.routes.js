import express from "express";
import {
  getAllPosts,
  getPostById,
  getUserPosts,
  searchPosts,
  createPost,
  updatePost,
  replacePost,
  deletePost,
  getDashboard,
  getPostsByTag,
  getPostsByCategory
} from "../controllers/posts.controller.js";

import {requireAuth} from "../middleware/auth.middleware.js";
// const upload = require("../middleware/uploadMiddleware");
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/user/posts", requireAuth,  getUserPosts);
router.get("/dashboard", requireAuth, getDashboard);
router.get("/tags/:tagName/posts", getPostsByTag);
router.get("/categories/:categoryName/posts", getPostsByCategory);
router.get("/:postId", getPostById);

router.post("/",requireAuth, upload.single("cover_image"),  createPost);
router.patch("/:postId", requireAuth,  updatePost);
router.put("/:postId", requireAuth,  replacePost);
router.delete("/:postId",requireAuth,  deletePost);

export default router;
