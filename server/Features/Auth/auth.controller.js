import { safeParse } from "valibot";
import { LoginSchema, RegisterationSchema } from "./auth.schema.js";
import { User } from "../HOME/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function Register(req, res) {
  try {
    const Inputs = req.body;
    const ValidatedInfo = await safeParse(RegisterationSchema, Inputs);

    if (!ValidatedInfo.success) {
      return res.status(400).json(ValidatedInfo.issues[0].message);
    } else {
      console.log(ValidatedInfo.output); //to check for myself
      const { username, password, email } = ValidatedInfo.output;
      const userExists = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (userExists) {
        return res.status(409).json({ message: "User already exists!!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        ...ValidatedInfo.output,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(201)
        .json({ username: newUser.username, email: newUser.email });
      
      console.log("registration done")
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function Login(req, res) {
  try {
    const LoginInputs = req.body;

    const ValidatedLogin = await safeParse(LoginSchema, LoginInputs);

    if (!ValidatedLogin.success) {
      return res
        .status(401)
        .json({ message: ValidatedLogin.issues[0].message });
    }
    const { email, password } = ValidatedLogin.output;
    const registeredUser = await User.findOne({
      email: email,
    });
    if (!registeredUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const matchPassword = await bcrypt.compare(
      password,
      registeredUser.password,
    );

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: registeredUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ username: registeredUser.username, email: registeredUser.email });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error ${err} ` });
  }
}

export async function Logout (req, res){
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      path: "/", 
    });

    res
      .status(200)
      .json({ message: "Telemetry link disconnected successfully." });
    console.log("cleaned the cookie")
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Error during disconnect sequence." });
  }
};

export async function VerifyPilot(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Pilot profile not found in database." });
    }
    res.status(200).json({
      message: "Secure link verified.",
      user: {
        username: user.username,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res
      .status(500)
      .json({ message: "Server error during verification sequence." });
  }
}
