import "./custom";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookiePaser from "cookie-parser";
import initConnect from "./services/db";
import route from "./routes";
import parseBearertoCookiesMiddleware from "./middlewares/parseBearertoCookies.middleware";
import { createServer } from "http";
import { initSocket } from "./socket";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookiePaser());
app.use(parseBearertoCookiesMiddleware());
route(app);
const httpServer = createServer(app);
initSocket(httpServer);
httpServer.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
initConnect();
