import express from "express";
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";
const routerAdmin = express.Router();

routerAdmin
  .get("/signup", adminController.getSignup)
  .post(
    "/signup",
    makeUploader("admin").single("memberImage"),
    adminController.signup
  );

routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/login", adminController.getLogin)
  .post(
    "/login",
    makeUploader("admin").single("memberImage"),
    adminController.login
  );

routerAdmin.get("/logout", adminController.logout);

//PRODUCTS

routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin,
  productController.getAllProducts
);

routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);

routerAdmin.post(
  "/product/:id",
  adminController.verifyAdmin,
  productController.updateChosenProduct
);
//!SHU YERDA UPDATE CHOSEN PRODUCT MANTIG'INI YARATISHIM MUMKIN

//USERS
routerAdmin.get(
  "/user/all",
  adminController.verifyAdmin,
  adminController.getUsers
);

routerAdmin.post(
  "/user/edit",
  adminController.verifyAdmin,
  makeUploader("members").single("memberImage"),
  adminController.updateChosenUser
);

export default routerAdmin;
