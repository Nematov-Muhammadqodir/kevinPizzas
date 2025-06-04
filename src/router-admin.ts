import express from "express";
import adminController from "./controllers/admin.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";
const routerAdmin = express.Router();

routerAdmin.post(
  "/signup",
  makeUploader("admin").single("memberImage"),
  adminController.signup
);

routerAdmin.post(
  "/login",
  makeUploader("admin").single("memberImage"),
  adminController.login
);

routerAdmin.get("/logout", adminController.logout);

//PRODUCTS

routerAdmin.post(
  "/product/create",
  adminController.verifyAdmin,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);

routerAdmin.get(
  "/product/all",
  adminController.verifyAdmin,
  productController.getAllProducts
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
