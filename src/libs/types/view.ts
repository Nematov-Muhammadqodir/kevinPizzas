import { ViewGroup } from "../enums/view.enum";
import { ObjectId } from "mongoose";

export interface View {
  _id: ObjectId;
  viewGroup: ViewGroup;
  memberId: ObjectId;
  viewRefId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  viewGroup: ViewGroup;
  memberId: ObjectId;
  viewRefId: ObjectId;
}
