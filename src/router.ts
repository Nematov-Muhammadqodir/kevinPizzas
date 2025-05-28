import express from "express";
import { Response, Request } from "express";
import memberController from "./controllers/member.controller";

const router = express.Router();

router.post("/member/signup", memberController.processSignup);

router.post("/member/login", memberController.processLogin);

export default router;
