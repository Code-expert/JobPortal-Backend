import User from '../Models/User.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from '../Connection/datauri.js';
import cloudinary from '../Connection/cloudinary.js';

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { Fullname, Email, PhoneNumber, Password, Role } = req.body;
    if (!Fullname || !Email || !PhoneNumber || !Password || !Role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if file was uploaded (for profile photo)
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile photo is required",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Check if a user already exists with this Email
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this Email",
        success: false,
      });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(Password, 10);
    await User.create({
      Fullname,
      Email,
      PhoneNumber,
      Password: hashedPassword,
      Role,
      Profile: {
        ProfilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Registration Error", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { Email, Password, Role } = req.body;
    if (!Email || !Password || !Role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(Password, user.Password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    if (Role !== user.Role) {
      return res.status(400).json({
        message: "Account doesn't exist with the current role",
        success: false,
      });
    }

    const tokenData = {
      userid: user._id,
      Fullname: user.Fullname,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role,
      Profile: user.Profile,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Create a user object to return
    user = {
      _id: user._id,
      Fullname: user.Fullname,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role,
      Profile: user.Profile,
    };

    // Set the cookie with secure options for production
    return res.status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,        // Use secure: true (only over HTTPS)
        sameSite: "none",    // Allow cross-site cookies
      })
      .json({
        message: `Welcome Back ${user.Fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log("Login error", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// LOGOUT USER
export const logout = async (req, res) => {
  try {
    return res.status(201)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logout Successfully",
        success: true,
      });
  } catch (error) {
    console.log("Logout error", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// UPDATE PROFILE (Including File Upload Handling)
export const updateProfile = async (req, res) => {
  try {
    const { Fullname, Email, PhoneNumber, bio, skills } = req.body;
    const file = req.file;

    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: file.mimetype === "application/pdf" ? "raw" : "auto",
        public_id: `resumes/${req.id}_${Date.now()}`,
      });
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }

    // Update user data if provided
    if (Fullname) user.Fullname = Fullname;
    if (Email) user.Email = Email;
    if (PhoneNumber) user.PhoneNumber = PhoneNumber;
    if (bio) user.Profile.bio = bio;
    if (skills) user.Profile.skills = skillsArray;

    if (cloudResponse) {
      user.Profile.resume = cloudResponse.secure_url;
      user.Profile.ResumeoriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      Fullname: user.Fullname,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      Role: user.Role,
      Profile: user.Profile,
    };

    return res.status(201).json({
      message: "Profile Updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("updateProfile Error", error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
