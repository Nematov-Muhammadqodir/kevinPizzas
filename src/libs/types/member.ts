import { ObjectId } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberNick: string;
  memberStatus: MemberStatus;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberImage?: string;
  memberPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberPassword: string;
  memberNick: string;
}

export interface MemberUpdateInput {
  _id: ObjectId;
  memberStatus?: MemberStatus;
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberImage?: string;
}
