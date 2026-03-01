
export const likePost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);
  try {
    const result = await db.query(
      `INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
      [postId, req.user.id],
    );

    res.status(201).json({
      message: "Like Post successfully",
    });
  } catch (err) {
    console.log("POST /api/posts/:postId/like: ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const unlikePost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);
  try {
    const result = await db.query(
      `DELETE FROM likes WHERE post_id = $1 AND user_id = $2;`,
      [postId, req.user.id],
    );

    res.status(200).json({
      message: "Unlike Post successfully",
    });
  } catch (err) {
    console.log("POST /api/posts/:postId/like: ", err);
    res.status(500).json({ message: "Server error" });
  }
}