import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import * as middlewares from "./middlewares";
import MessageResponse from "./interfaces/MessageResponse";
import { connectToDb } from "./connection/connectToDb";
import { authRouter } from "./routes/auth/user.routes";
import { teacherRouter } from "./routes/teacher/teacher.routes";
import { chapterRouter } from "./routes/teacher/chapter.routes";
import { studentRouter } from "./routes/student/student.routes";
import { playlisRouter } from "./routes/playlist/playlist.routes";

require("dotenv").config();

connectToDb(process.env.DB_URI!);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Welcome to course garden 🚀",
  });
});

app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use("/chapter", chapterRouter);
app.use("/student", studentRouter);
app.use("/playlist", playlisRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
