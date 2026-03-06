import db from "../config/db.js";

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
        `SELECT id,name,email, bio, profile_image, created_At, (SELECT COUNT(*) FROM posts WHERE author_id = $1 ) AS total_Posts FROM users WHERE id = $1;`,
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

export const updateProfileImage = async (req, res) =>{
  try {
      const profile_image = req.file ? req.file.filename : null;

    const result = await db.query("UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING profile_image;",
      [profile_image, req.user.id]
    )

    console.log(result.rows[0]);

    res.status(201).json({
      status : true,
      message: "Profile image uploaded successfully",
    });

  } catch (err) {
    console.log("patch - /api/users/:userId/profile-picture: ", err);
    
  }
}

export const removeProfileImage = async (req, res) =>{
  try {
   
    const result = await db.query("UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING profile_image;",
      [null, req.user.id]
    )

    console.log(result.rows[0]);

    res.status(201).json({
      status : true,
      message: "Profile image removed",
    });

  } catch (err) {
    console.log("patch - /api/users/:userId/removeProfileImage: ", err);
    
  }
}

export const getMe = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.user);
}

export const updateProfile = (req, res) =>{

  try {
    const name = req.body.name;
    const bio = req.body.bio;
    const gender = req.body.gender;

    const result = db.query("UPDATE users SET name = $1, bio = $2 , gender = $3 WHERE id = $4;",
    [name, bio, gender, req.user.id]);

    res.status(201).json({
      status : true,
      message: "Profile update successfully",
    });
    
  } catch (err) {
    console.log("patch - /api/users/:userId/profile: ", err);
  }
}