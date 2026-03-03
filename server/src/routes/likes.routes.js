import express from "express";
import { likePost, unlikePost } from "../controllers/likes.controller.js";
import {requireAuth} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:postId",requireAuth, likePost);
router.delete("/:postId",requireAuth, unlikePost);

export default router;