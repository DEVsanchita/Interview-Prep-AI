const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();


// ================= MULTER CONFIG =================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WebP images are allowed"));
    }
  },
});


// ================= AUTH ROUTES =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Profile
router.get("/profile", protect, getUserProfile);


// ================= PROFILE =================

// Update name or profile image
router.put("/profile", protect, updateUserProfile);

// Delete account
router.delete("/account", protect, deleteUserAccount);


// ================= IMAGE UPLOAD =================

router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const imageUrl =
      `https://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      imageUrl,
    });
  }
);


module.exports = router;