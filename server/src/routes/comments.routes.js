import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/:postId", getComments);
router.post("/:postId", createComment);
router.put("/:postId/:id", updateComment);
router.delete("/:postId/:id", deleteComment);

export default router;