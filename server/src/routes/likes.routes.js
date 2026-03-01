import express from "express";
import { likePost, unlikePost } from "../controllers/likes.controller.js";

const router = express.Router();

router.post("/:postId", likePost);
router.delete("/:postId", unlikePost);

export default router;