import express from "express";
import passport from "../config/passport.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

// Google
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get(
//   "/google/secrets",
//   passport.authenticate("google", {
//     successRedirect: "--",
//     failureRedirect: "/login",
//   })
// );

// Login
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "--",
//     failureRedirect: "/login",
//   })
// );

router.post("/login", (req, res, next) =>{
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.login(user, (err)=>{
      if (err) return next(err);

       res.json({
        success: true,
        message: "Login successful",
        user,
      });

    });

  })(req, res, next);
});

// Register
router.post("/register", registerUser);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    
    if(err) return next(err);

    req.session.destroy(()=>{
      res.clearCookie("connect.sid");
      res.json({
         success: true,
        message: "Logged out successfully",
      });
    });

  });
});



export default router;