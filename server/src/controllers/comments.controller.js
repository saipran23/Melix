export const createComment = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);
  const content = req.body.content;

  try {
    const newComment = await db.query(
      "INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3)  RETURNING *;",
      [content, postId, req.user.id],
    );
    res.send(newComment.rows[0]);
  } catch (err) {
    console.log("post -- /api/posts/:postId/comments: ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const updateComment = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.id);
  const content = req.body.content;

  try {
    const editComment = await db.query(
      "UPDATE comments SET content = $1 WHERE post_id = $2 AND user_id = $3 AND id = $4 RETURNING *;",
      [content, postId, req.user.id, commentId],
    );
    res.send(editComment.rows[0]);
  } catch (err) {
    console.log("put -- /api/posts/:postId/comments/:id: ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const deleteComment  = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.id);

  try {
    const result = await db.query(
      "DELETE FROM comments  WHERE post_id = $1 AND Id = $2 AND  user_id = $3;",
      [postId, commentId, req.user.id],
    );

    res.status(201).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.log("delete -  /api/posts/:postId/comment/:id: ", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const getComments = async (req, res) => {
  const postId = parseInt(req.params.postId);

  try {
    const result = await db.query(
      `
      SELECT 
        c.*,
        u.name AS author_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
      `,
      [postId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET comments:", err);
    res.status(500).json({ message: "Server error" });
  }
}