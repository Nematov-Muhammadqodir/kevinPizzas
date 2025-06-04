import { shapeIntoMongooseObjectId } from "../libs/config";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import * as bcryptjs from "bcryptjs";

class AdminService {
  private readonly memberModel: any;
  constructor() {
    this.memberModel = MemberModel;
  }

  public async signup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel.findOne({
      memberType: MemberType.ADMIN,
    });
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    const salt = await bcryptjs.genSalt();
    input.memberPassword = await bcryptjs.hash(input.memberPassword, salt);
    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (err) {
      console.log("Error, signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel.findOne(
      {
        memberNick: input.memberNick,
        memberType: MemberType.ADMIN,
        memberStatus: { $ne: MemberStatus.DELETE },
      },
      { memberNick: 1, memberType: 1, memberStatus: 1, memberPassword: 1 }
    );

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    else if (member.memberStatus === MemberStatus.BLOCK)
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    const isMatch = await bcryptjs.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch)
      throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_PASSWORD);

    const result = await this.memberModel.findOne({ _id: member._id });
    if (!result)
      throw new Errors(
        HttpCode.INTERNAL_SERVER_ERROR,
        Message.SOMETHING_WENT_WRONG
      );
    return result;
  }

  public async getUsers(): Promise<Member[]> {
    console.log("service getUsers");
    const result = await this.memberModel.find({
      memberStatus: MemberStatus.ACTIVE,
      memberType: MemberType.USER,
    });
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateChosenUser(
    memberInput: MemberUpdateInput
  ): Promise<Member> {
    console.log("service: updateChosenUser");
    const memberId = shapeIntoMongooseObjectId(memberInput._id);
    const result = await this.memberModel
      .findByIdAndUpdate(memberId, memberInput, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    console.log("res", result);
    return result;
  }
}

export default AdminService;
