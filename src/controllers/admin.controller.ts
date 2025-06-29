import { Request, Response } from "express";

import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import {
  AdminRequest,
  LoginInput,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import AdminService from "../moduls/Admin.service";
import { MemberType } from "../libs/enums/member.enum";
import { NextFunction } from "connect";

const adminService = new AdminService();
const adminController: T = {};

adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (error) {
    console.log("Error, goHome", error);
    res.redirect("/admin");
  }
};

adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
    //send | json | redirect | end
  } catch (err) {
    console.log("Error, getSignup", err);
    res.redirect("/admin");
  }
};

adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin", err);
    res.redirect("/admin");
  }
};

adminController.signup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("signup");
    const image = req.file;
    if (!image)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const input: MemberInput = req.body;
    input.memberImage = image.path;
    input.memberType = MemberType.ADMIN;
    const result = await adminService.signup(input);
    req.session.member = result;
    req.session.save(() => {
      res.status(HttpCode.OK).json(result);
    });
  } catch (err) {
    console.log("Error, signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.login = async (req: AdminRequest, res: Response) => {
  try {
    console.log("login");
    const loginInput: LoginInput = req.body;
    const result = await adminService.login(loginInput);
    req.session.member = result;
    req.session.save(() => {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");

    res.clearCookie("connect.sid");
    req.session.destroy(() => {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, logout", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.getUsers = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getUsers");
    if (req.session.member.memberType !== MemberType.ADMIN)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    const result = await adminService.getUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, logout", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const input = req.body;
    const result = await adminService.updateChosenUser(input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateChosenUser", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.verifyAdmin = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.ADMIN) {
    console.log("verifyAdmin");
    req.member = req.session.member;
    next();
  } else {
    throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
  }
};

export default adminController;
