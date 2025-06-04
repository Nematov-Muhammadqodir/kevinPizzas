import express from "express";
const app = express();
import path from "path";
import router from "./router";
import cookieParser from "cookie-parser";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import routerAdmin from "./router-admin";

const MongoDBSession = ConnectMongoDB(session);

const store = new MongoDBSession({
  uri: String(process.env.MONGODB_URL),
  collection: "sessions",
});

//ENTRANCE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//__dirname gives us absolute path, which is the path the app is running, so it means go to the folder where the server is running and find the public folder from here
app.use("/uploads", express.static("./uploads"));
app.use(cookieParser());
app.use(
  session({
    secret: String(process.env.SECRET_TOKEN),
    cookie: { maxAge: 1000 * 60 * 60 * 3 },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

//SESSIONS

//VIEWS

//ROUTER

app.use("/admin", routerAdmin);
app.use("/", router); //frontend

export default app;
