import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../moduls/Member.service";
import { ExtendedRequest, LoginInput, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../moduls/Auth.service";
import { NextFunction } from "connect";
import { OAuth2Client } from "google-auth-library";

const memberService = new MemberService();
const authService = new AuthService();
const memberController: T = {};

memberController.processSignup = async (req: Request, res: Response) => {
  try {
    console.log("processSignup");
    const input: MemberInput = req.body;
    const result = await memberService.processSignup(input);
    console.log("signup result", result);
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      maxAge: 24 * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, processSignup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.processLogin = async (req: Request, res: Response) => {
  try {
    const loginInput: LoginInput = req.body;
    const result = await memberService.processLogin(loginInput);
    console.log("login result", result);
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, { maxAge: 24 * 3600 * 1000 });

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, processLogin", err);
    throw new Errors(HttpCode.BAD_REQUEST, Message.NOT_AUTHENTICATED);
  }
};

memberController.processLogout = async (req: Request, res: Response) => {
  try {
    console.log("processLogout");
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, processLogout", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("getAllUsers");

    const result = await memberService.getAllUsers();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, logout", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const result = await memberService.getMemberDetail(req.member);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    const updateInput = req.body;
    if (req.file) updateInput.memberImage = req.file.path.replace(/\\/g, "/");

    const result = await memberService.updateMember(req.member, updateInput);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateMember", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    const result = await memberService.getTopUsers();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTopUsers", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
    console.log("token", token);
    console.log("req.member", req.member);
    // if (!req.member)
    //   throw new Errors(HttpCode.UNAUTHORIZED, Message.CREATE_FAILED);

    next();
  } catch (err) {
    console.log("Error, verifyAuth", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("retrieveAuth");
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);
    next();
  } catch (err) {
    console.log("Error retrieveAuth", err);
    next();
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE AUTHENTICATION
memberController.processGoogleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // ✅ Validate essential fields
    const memberNick = payload?.name;
    const memberPhone = "GOOGLE_" + payload?.sub;
    const memberImage = payload?.picture;
    const googleId = payload?.sub;

    if (!memberNick || !googleId || !memberImage) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    // ✅ No more "possibly undefined"
    let member = await memberService.findMemberByNick(memberNick);

    if (!member) {
      const newMemberInput: MemberInput = {
        memberNick,
        memberPhone,
        memberPassword: googleId, // You could hash this later
        memberImage,
      };

      member = await memberService.processSignup(newMemberInput);
    }

    const authToken = await authService.createToken(member);
    res.cookie("accessToken", authToken, {
      maxAge: 24 * 3600 * 1000,
      httpOnly: false,
    });

    res.status(200).json(member);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

export default memberController;
