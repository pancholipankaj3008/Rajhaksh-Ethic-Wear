const express = require("express");
const { Auth, RefreshAccessToken } = require("../Middlewares/Auth");
const { SignUp, Login, Logout, GetProfile, UpdateProfile, ChangePassword, CreateByAdmin, GetAllUsers, UpdateUserByAdmin, BlockUser, UnblockUser } = require("../Controllers/UserController");
const router = express.Router();
router.post("/signup", SignUp); router.post("/login", Login); router.post("/refresh", RefreshAccessToken); router.post("/logout", Auth("customer", "admin"), Logout);
router.get("/profile", Auth("customer", "admin"), GetProfile); router.put("/update-profile", Auth("customer", "admin"), UpdateProfile); router.put("/change-password", Auth("customer", "admin"), ChangePassword);
router.post("/create-user", Auth("admin"), CreateByAdmin); router.get("/all-users", Auth("admin"), GetAllUsers); router.put("/update-user/:id", Auth("admin"), UpdateUserByAdmin); router.put("/block-user/:id", Auth("admin"), BlockUser); router.put("/unblock-user/:id", Auth("admin"), UnblockUser);
module.exports = router;
