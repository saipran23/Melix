import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments
} from "../controllers/comments.controller.js";
import {requireAuth} from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:postId", getComments);
router.post("/:postId",requireAuth, createComment);
router.put("/:postId/:id",requireAuth, updateComment);
router.delete("/:postId/:id",requireAuth, deleteComment);

export default router;