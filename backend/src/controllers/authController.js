import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const username = req.body.username?.trim();

    if (!username) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    if (username.length > 30) {
      return res.status(400).json({
        message: "Username must be 30 characters or less"
      });
    }

    let user = await User.findOne({ username });

    const profilePhoto = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : "";

    if (!user) {
      user = await User.create({
        username,
        profilePhoto
      });
    } else if (req.file) {
      user.profilePhoto = profilePhoto;
      await user.save();
    }

    res.json({
      message: "Login successful",
      user
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};

export {
  login
};