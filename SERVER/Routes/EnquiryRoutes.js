const express = require("express");
const { Auth } = require("../Middlewares/Auth");
const { CreateEnquiry, GetEnquiries, GetEnquiry, UpdateEnquiry, DeleteEnquiry } = require("../Controllers/EnquiryController");
const router = express.Router();
// Guests may submit an enquiry; authenticated customers are linked automatically.
router.post("/", (req, res, next) => { const token = req.cookies?.accessToken; if (!token) return next(); return Auth("customer", "admin")(req, res, next); }, CreateEnquiry);
router.get("/", Auth("admin"), GetEnquiries);
router.get("/:id", Auth("admin"), GetEnquiry);
router.put("/:id", Auth("admin"), UpdateEnquiry);
router.delete("/:id", Auth("admin"), DeleteEnquiry);
module.exports = router;
