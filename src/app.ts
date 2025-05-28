import express from "express";
const app = express();
import path from "path";
import router from "./router";
import cookieParser from "cookie-parser";

//ENTRANCE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(cookieParser());

//SESSIONS

//VIEWS

//ROUTER

app.use("/", router);

export default app;
