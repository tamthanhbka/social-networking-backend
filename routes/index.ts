import { Express } from "express";
import authRoute from "./auth";
import postRoute from "./post";
import userRoute from "./user";
import meRoute from "./me";

export default function initRoutes(app: Express) {
  app.use("/auth", authRoute);
  app.use("/post", postRoute);
  app.use("/user", userRoute);
  app.use("/me", meRoute);

  app.use("/", (req, res) => {
    res.status(403).send("No route for path /");
  });
}
