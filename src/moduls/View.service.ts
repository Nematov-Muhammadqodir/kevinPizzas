import Errors from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";
import { HttpCode, Message } from "../libs/Errors";

class ViewService {
  private readonly viewModel;
  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkView(input: ViewInput): Promise<View> {
    return await this.viewModel
      .findOne({
        memberId: input.memberId,
        viewRefId: input.viewRefId,
      })
      .exec();
  }

  public async insertProductView(input: ViewInput): Promise<View> {
    try {
      console.log("insertProductView");
      const result = await this.viewModel.create(input);
      return result;
    } catch (err) {
      console.log("Error insertProductView", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
