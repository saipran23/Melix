import db from "../config/db.js";

// fetch all posts
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.cover_image,
        p.status,
        p.created_at,
        p.viewcount,
        u.id AS author_id,
        u.name AS author_name,
        COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags,
        COALESCE(json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '[]') AS categories,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.status = 'published' 
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// fetch post by id
export const getPostById = async (req, res) => {
  const postId = parseInt(req.params.postId);

  if (!postId) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    await db.query("BEGIN");

    await db.query(
      "UPDATE posts SET viewCount = viewCount + 1 WHERE id = $1",
      [postId],
    );

    const result = await db.query(
      `
      SELECT 
        p.*,
        u.id AS author_id,
        u.name AS author_name,
        u.email AS author_email,
        COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags,
        COALESCE(json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '[]') AS categories,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.id = $1
      GROUP BY p.id, u.id
      `,
      [postId],
    );

    if (result.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Post not found" });
    }

    await db.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("GET /api/posts/:postId:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// fetch post by user
export const getUserPosts = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT 
        p.*,
        COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags,
        COALESCE(json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '[]') AS categories,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.author_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/posts/user/posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// fetch post for the search
export const searchPosts = async (req, res) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!search) {
    return res.status(400).json({ message: "Search query required" });
  }

  try {
    const result = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.cover_image,
        p.status,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name,
        COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags,
        COALESCE(json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '[]') AS categories,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.status = 'published'
        AND (
          p.title ILIKE '%' || $1 || '%' OR
          t.name ILIKE '%' || $1 || '%' OR
          c.name ILIKE '%' || $1 || '%'
        )
      GROUP BY p.id, u.id
      ORDER BY p.updated_at DESC
      LIMIT $2 OFFSET $3
      `,
      [search, limit, offset],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/search:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// create the post
export const createPost = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, content, status, tags, categories } = req.body;

  const cover_image = req.file ? req.file.filename : null;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    await db.query("BEGIN");

    const postResult = await db.query(
      `INSERT INTO posts (title, content, cover_image, status, author_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        title,
        content,
        cover_image,
        status || "draft",
        req.user.id
      ]
    );

    const postId = postResult.rows[0].id;

    /* ---------------- TAGS ---------------- */

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);

      const cleanTags = tagArray
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== "");

      for (const tagName of cleanTags) {
        let tagResult = await db.query(
          "SELECT id FROM tags WHERE name = $1",
          [tagName]
        );

        if (tagResult.rows.length === 0) {
          tagResult = await db.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING id",
            [tagName]
          );
        }

        await db.query(
          `INSERT INTO post_tags (post_id, tag_id)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [postId, tagResult.rows[0].id]
        );
      }
    }

    /* ---------------- CATEGORIES ---------------- */

    if (categories) {
      const categoryArray = Array.isArray(categories)
        ? categories
        : JSON.parse(categories);

      const cleanCategories = categoryArray
        .map((cat) => cat.trim().toLowerCase())
        .filter((cat) => cat !== "");

      for (const catName of cleanCategories) {
        let catResult = await db.query(
          "SELECT id FROM categories WHERE name = $1",
          [catName]
        );

        if (catResult.rows.length === 0) {
          catResult = await db.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING id",
            [catName]
          );
        }

        await db.query(
          `INSERT INTO post_categories (post_id, category_id)
           VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [postId, catResult.rows[0].id]
        );
      }
    }

    await db.query("COMMIT");

    res.status(201).json({
      message: "Post created successfully",
      postId
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      message: "Server error while creating post"
    });
  }
};

// patch the post
export const updatePost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  if (!postId) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, content, cover_image, status, tags, categories } = req.body;

  try {
    await db.query("BEGIN");

    const postCheck = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

    if (postCheck.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Post not found" });
    }

    if (postCheck.rows[0].author_id !== req.user.id) {
      await db.query("ROLLBACK");
      return res.status(403).json({ message: "Forbidden" });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }

    if (content !== undefined) {
      fields.push(`content = $${index++}`);
      values.push(content);
    }

    if (cover_image !== undefined) {
      fields.push(`cover_image = $${index++}`);
      values.push(cover_image);
    }

    if (status !== undefined) {
      if (!["draft", "published"].includes(status)) {
        await db.query("ROLLBACK");
        return res.status(400).json({ message: "Invalid status value" });
      }
      fields.push(`status = $${index++}`);
      values.push(status);
    }
    if (fields.length > 0) {
      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      await db.query(
        `UPDATE posts 
         SET ${fields.join(", ")}
         WHERE id = $${index}`,
        [...values, postId],
      );
    }

    if (Array.isArray(tags)) {
      const existingTagsResult = await db.query(
        `SELECT t.name
         FROM tags t
         JOIN post_tags pt ON t.id = pt.tag_id
         WHERE pt.post_id = $1`,
        [postId],
      );

      const existingTags = existingTagsResult.rows.map((r) => r.name);

      const incomingTags = tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== "");

      const tagsToInsert = incomingTags.filter(
        (tag) => !existingTags.includes(tag),
      );

      const tagsToDelete = existingTags.filter(
        (tag) => !incomingTags.includes(tag),
      );

      for (const tagName of tagsToDelete) {
        await db.query(
          `DELETE FROM post_tags
           WHERE post_id = $1
           AND tag_id = (
             SELECT id FROM tags WHERE name = $2
           )`,
          [postId, tagName],
        );
      }

      for (const tagName of tagsToInsert) {
        let tagResult = await db.query("SELECT id FROM tags WHERE name = $1", [
          tagName,
        ]);

        if (tagResult.rows.length === 0) {
          tagResult = await db.query(
            "INSERT INTO tags (name) VALUES ($1) RETURNING id",
            [tagName],
          );
        }

        await db.query(
          `INSERT INTO post_tags (post_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [postId, tagResult.rows[0].id],
        );
      }
    }

    if (Array.isArray(categories)) {
      const existingCategoriesResult = await db.query(
        `SELECT c.name
         FROM categories c
         JOIN post_categories pc ON c.id = pc.category_id
         WHERE pc.post_id = $1`,
        [postId],
      );

      const existingCategories = existingCategoriesResult.rows.map(
        (r) => r.name,
      );

      const incomingCategories = categories
        .map((cat) => cat.trim().toLowerCase())
        .filter((cat) => cat !== "");

      const categoriesToInsert = incomingCategories.filter(
        (cat) => !existingCategories.includes(cat),
      );

      const categoriesToDelete = existingCategories.filter(
        (cat) => !incomingCategories.includes(cat),
      );

      for (const catName of categoriesToDelete) {
        await db.query(
          `DELETE FROM post_categories
           WHERE post_id = $1
           AND category_id = (
             SELECT id FROM categories WHERE name = $2
           )`,
          [postId, catName],
        );
      }

      for (const catName of categoriesToInsert) {
        let catResult = await db.query(
          "SELECT id FROM categories WHERE name = $1",
          [catName],
        );

        if (catResult.rows.length === 0) {
          catResult = await db.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING id",
            [catName],
          );
        }

        await db.query(
          `INSERT INTO post_categories (post_id, category_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [postId, catResult.rows[0].id],
        );
      }
    }

    await db.query("COMMIT");

    res.json({ message: "Post updated successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// put the post
export const replacePost = async (req, res) => {
  const postId = parseInt(req.params.postId);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  const {
    title,
    content,
    cover_image,
    status,
    tags = [],
    categories = [],
  } = req.body;

  try {
    await db.query("BEGIN");

    const postCheck = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

    if (postCheck.rows.length === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Post not found" });
    }

    if (postCheck.rows[0].author_id !== req.user.id) {
      await db.query("ROLLBACK");
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedPost = await db.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           cover_image = $3,
           status = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, content, cover_image, status, postId],
    );

    // Delete old tag relations
    await db.query("DELETE FROM post_tags WHERE post_id = $1", [postId]);

    for (const rawTag of tags) {
      const tagName = rawTag.trim().toLowerCase();
      if (!tagName) continue;

      let tagResult = await db.query("SELECT * FROM tags WHERE name = $1", [
        tagName,
      ]);

      if (tagResult.rows.length === 0) {
        tagResult = await db.query(
          "INSERT INTO tags (name) VALUES ($1) RETURNING *",
          [tagName],
        );
      }

      await db.query(
        `INSERT INTO post_tags (post_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [postId, tagResult.rows[0].id],
      );
    }

    // Delete old category relations
    await db.query("DELETE FROM post_categories WHERE post_id = $1", [postId]);

    for (const rawCategory of categories) {
      const categoryName = rawCategory.trim().toLowerCase();
      if (!categoryName) continue;

      let categoryResult = await db.query(
        "SELECT * FROM categories WHERE name = $1",
        [categoryName],
      );

      if (categoryResult.rows.length === 0) {
        categoryResult = await db.query(
          "INSERT INTO categories (name) VALUES ($1) RETURNING *",
          [categoryName],
        );
      }

      await db.query(
        `INSERT INTO post_categories (post_id, category_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [postId, categoryResult.rows[0].id],
      );
    }

    await db.query("COMMIT");

    res.json({
      message: "Post updated successfully",
      post: updatedPost.rows[0],
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// delete the post
export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.postId);
  try {
    if (!postId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await db.query("DELETE FROM posts WHERE id = $1 AND author_id = $2", [
      postId,
      req.user.id,
    ]);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log("delete - /api/posts/:postId: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get user dahboard
export const getDashboard = async (req, res) => {
  try {
    const dashboard = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM posts WHERE author_id = $1) AS total_posts,
        (SELECT COUNT(*) FROM posts WHERE author_id = $1 AND status = 'draft') AS draft_posts,
        (SELECT COUNT(*) FROM posts WHERE author_id = $1 AND status = 'published') AS published_posts,
        (SELECT COALESCE(SUM(viewcount),0) FROM posts WHERE author_id = $1) AS total_views,
        (SELECT COUNT(*) FROM likes JOIN posts ON likes.post_id = posts.id WHERE posts.author_id = $1) AS total_likes,
        (SELECT COUNT(*)  FROM comments JOIN posts  ON comments.post_id = posts.id  WHERE posts.author_id = $1) AS total_comments
    `,
      [req.user.id],
    );
    res.json(dashboard.rows[0]);
  } catch (err) {
    console.log("get - /api/user/dashboard: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get posts by tage name
export const getPostsByTag = async (req, res) => {
  const tagName = req.params.tagName;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!tagName) {
    return res.status(400).json({ message: "Invalid tage Name" });
  }

  try {
    const filterBytags = await db.query(
      `SELECT    posts.id,
          posts.title,
          posts.cover_image,
          posts.status,
          posts.created_at,
          users.id AS author_id,
          users.name AS author_name,
          (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count
        FROM posts 
        LEFT JOIN users  ON posts.author_id = users.id
        LEFT JOIN post_tags ON posts.id = post_tags.post_id
        LEFT JOIN tags ON post_tags.tag_id = tags.id
        LEFT JOIN post_categories  ON posts.id = post_categories.post_id
        LEFT JOIN categories  ON post_categories.category_id = categories.id
        WHERE posts.status = 'published' AND tags.name = $1
        GROUP BY posts.id, users.id
        ORDER BY posts.created_at DESC LIMIT $2 OFFSET $3`,
      [tagName, limit, offset],
    );

    res.send(filterBytags.rows);
  } catch (err) {
    console.log("get - /api/tags/:tagName/posts: ", err);
  }
};

// get posts by category name
export const getPostsByCategory = async (req, res) => {
  const categoryName = req.params.categoryName;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!categoryName) {
    return res.status(400).json({ message: "Invalid tage Name" });
  }

  try {
    const filterBycategories = await db.query(
      `SELECT    posts.id,
          posts.title,
          posts.cover_image,
          posts.status,
          posts.created_at,
          users.id AS author_id,
          users.name AS author_name,
           COALESCE(json_agg(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL), '[]') AS tags,
          COALESCE(json_agg(DISTINCT categories.name) FILTER (WHERE categories.name IS NOT NULL), '[]') AS categories,
          (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count
        FROM posts 
        LEFT JOIN users  ON posts.author_id = users.id
        LEFT JOIN post_tags ON posts.id = post_tags.post_id
        LEFT JOIN tags ON post_tags.tag_id = tags.id
        LEFT JOIN post_categories  ON posts.id = post_categories.post_id
        LEFT JOIN categories  ON post_categories.category_id = categories.id
        WHERE posts.status = 'published' AND categories.name = $1
        GROUP BY posts.id, users.id
        ORDER BY posts.created_at DESC LIMIT $2 OFFSET $3`,
      [categoryName, limit, offset],
    );
    res.send(filterBycategories.rows);
  } catch (err) {
    console.log("get - /api/categories/:categoryName/posts", err);
  }
};
