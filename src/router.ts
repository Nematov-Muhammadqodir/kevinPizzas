import express from "express";

import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import likeController from "./controllers/like.controller";

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

router.get("/member/all", memberController.getAllUsers);

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

//*! PRODUCTS
router.get(
  "/product/all",
  memberController.retrieveAuth,
  productController.getAllUserProducts
);

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

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);

//! LIKE
router.post(
  "/like/toggle",
  memberController.verifyAuth,
  likeController.toggleLike
);

router.get(
  "/like/allProducts",
  memberController.verifyAuth,
  likeController.getLikedProducts
);
// GOOGLE AUTHENTICATION
router.post("/member/google-login", memberController.processGoogleLogin);

export default router;
