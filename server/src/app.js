import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";

const app = express();

import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import usersRoutes from "./routes/users.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import authRoutes from "./routes/auth.routes.js";

// import { errorHandler } from "./middleware/error.middleware.js";
import { requireAuth } from "./middleware/auth.middleware.js";

// app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/likes", likesRoutes);

export default app;
