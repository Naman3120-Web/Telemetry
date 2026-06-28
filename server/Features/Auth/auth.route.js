import express from "express";
import { Login, Register, Logout } from "./auth.controller.js";
import VerifyToken from "./auth.middleware.js";
const authRouter = express.Router();
authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

export default authRouter;
