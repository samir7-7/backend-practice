import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(cookieParser());
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);
app.use(express.static("public"));

//routes
import userRoutes from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRoutes);

export { app };
