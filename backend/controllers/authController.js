/* const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl = null } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword, profileImageUrl });
    res.status(201).json({ ...sanitizeUser(user), token: generateToken(user._id) });
  } catch (error) {
    console.error("registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ ...sanitizeUser(user), token: generateToken(user._id) });
  } catch (error) {
    console.error("loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
 */
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImageUrl: user.profileImageUrl,
});


// ==================== REGISTER ====================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profileImageUrl = null,
    } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      profileImageUrl,
    });

    res.status(201).json({
      ...sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("registerUser:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================== LOGIN ====================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (
      !user ||
      !(await bcrypt.compare(password || "", user.password))
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      ...sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("loginUser:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================== GET PROFILE ====================

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("getUserProfile:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================== UPDATE PROFILE ====================

const updateUserProfile = async (req, res) => {
  try {
    const { name, profileImageUrl } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update name if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // Update profile image if provided
    if (profileImageUrl !== undefined) {
      user.profileImageUrl = profileImageUrl;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("updateUserProfile:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================== DELETE ACCOUNT ====================

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("deleteUserAccount:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==================== EXPORTS ====================

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};