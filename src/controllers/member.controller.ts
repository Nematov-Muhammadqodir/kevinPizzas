import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../moduls/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../moduls/Auth.service";

const memberService = new MemberService();
const authService = new AuthService();
const memberController: T = {};

memberController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");
    const input: MemberInput = req.body;
    const result = await memberService.processSignup(input),
      token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: 24 * 3600 * 100,
      httpOnly: false,
    });
    await res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, processSignup", err);
  }
};

memberController.processLogin = async (req: Request, res: Response) => {
  try {
    const loginInput: LoginInput = req.body;
    const result = await memberService.processLogin(loginInput),
      token = await authService.createToken(result);
    res.cookie("accessToken", token);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, processLogin", err);
    throw new Errors(HttpCode.BAD_REQUEST, Message.NOT_AUTHENTICATED);
  }
};

export default memberController;
