import mongoose, { Schema } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },
    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberPassword: {
      type: String,
      select: false,
      required: true,
    },
    memberAddress: {
      type: String,
    },
    memberImage: {
      type: String,
    },
    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
