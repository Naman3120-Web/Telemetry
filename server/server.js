import express from "express";
import cors from "cors";
import ConnectToMGDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./Features/Auth/auth.route.js";

ConnectToMGDB();
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hello user");
});

app.listen(3000, () => {
  console.log(`server is happy on http://localhost:3000`);
});
