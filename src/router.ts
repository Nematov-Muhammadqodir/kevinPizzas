import express from "express";

import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

const router = express.Router();

//~ MEMBERS

router.post("/member/signup", memberController.processSignup);

router.post("/member/login", memberController.processLogin);

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.processLogout
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateMember
);

router.get(
  "/member/top-users",
  memberController.retrieveAuth,
  memberController.getTopUsers
);

//^ PRODUCTS
router.get("/product/all", productController.getAllUserProducts);

router.get(
  "/product/:productId",
  memberController.retrieveAuth,
  productController.getProduct
);

//& ORDER
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);

router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

export default router;
