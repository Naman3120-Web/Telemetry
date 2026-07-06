import express from "express";
import cors from "cors";
import ConnectToMGDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./Features/Auth/auth.route.js";

ConnectToMGDB();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin:process.env.VITE_FRONTEND_URL ,
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hello user");
});

app.listen(PORT, () => {
  console.log(`SERVER IS ACTIVE ON ${PORT}`);
});
