import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import LikeService from "../moduls/Like.service";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { HttpCode } from "../libs/Errors";
import { Request, Response } from "express";

const likeService = new LikeService();
const likeController: T = {};

likeController.toggleLike = async (req: ExtendedRequest, res: Response) => {
  const memberId = shapeIntoMongooseObjectId(req.member._id);
  const likeRefId = shapeIntoMongooseObjectId(req.body.likeRefId);
  console.log("likeRefId", typeof req.body.likeRefId);
  console.log("likeRefId", typeof likeRefId);

  const result = await likeService.toggleLike(memberId, likeRefId);
  console.log("Result", result);

  res.status(HttpCode.OK).json(result);
};

likeController.getLikedProducts = async (
  req: ExtendedRequest,
  res: Response
) => {
  const memberId = shapeIntoMongooseObjectId(req.member._id);

  const result = await likeService.getLikedProducts(memberId);
  console.log("contr result:", result);
  res.status(HttpCode.OK).json(result);
};

export default likeController;
