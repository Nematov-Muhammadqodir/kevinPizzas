import { ObjectId } from "mongoose";

export interface Like {
  _id: ObjectId;
  likeRefId: ObjectId;
  memberId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
