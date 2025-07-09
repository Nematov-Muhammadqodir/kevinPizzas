import mongoose from "mongoose";
import { T } from "./types/common";

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};

export const AUTH_TIMER = 24;

export const lookupAuthMemberLiked = (
  memberId: T,
  targetRefId: string = "$_id"
) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        localMemberId: memberId,
        localLikeRefId: targetRefId,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$likeRefId", "$$localLikeRefId"] },
                { $eq: ["$memberId", "$$localMemberId"] },
              ],
            },
          },
        },

        {
          $project: {
            _id: 1,
            likeRefId: 1,
            memberId: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
      as: "meLiked",
    },
  };
};
