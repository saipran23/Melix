export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.query(
      "SELECT id , name , email, profile_image FROM users;",
    );
    res.send(allUsers.rows);
  } catch (err) {
    console.log("get - /api/admin/users: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = parseInt(req.params.userId);
  if (req.user.id === userId) {
    try {
      let result = await db.query(
        `SELECT *, (SELECT COUNT(*) FROM posts WHERE author_id = $1 ) AS total_Posts FROM users WHERE id = $1;`,
        [req.user.id],
      );
      res.send(result.rows[0]);
    } catch (err) {
      console.log("get /api/users/:userId: ", err);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(403).json({
      message: "Invalid login",
    });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await db.query("SELECT * FROM tags");

    res.send(tags.rows);
  } catch (err) {
    console.log("get - /api/tags: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await db.query(
      "SELECT id, name FROM categories ORDER BY name;",
    );

    res.send(categories.rows);
  } catch (err) {
    console.log("get - /api/categories: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
