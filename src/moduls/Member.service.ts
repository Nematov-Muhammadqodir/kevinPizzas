import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import * as bcryptjs from "bcryptjs";
import { HttpCode, Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async processSignup(input: MemberInput): Promise<Member> {
    const salt = await bcryptjs.genSalt();
    input.memberPassword = await bcryptjs.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.log("Error, processSignup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberPassword: 1, memberNick: 1, memberStatus: 1 }
      )
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK)
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);

    const isMatch = await bcryptjs.compare(
      input.memberPassword,
      member.memberPassword
    );

    if (!isMatch)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    const result = await this.memberModel.findById(member._id).lean().exec();

    return result;
  }

  //   public async processLogout()
}

export default MemberService;
