import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { ViewGroup } from "../libs/enums/view.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import { ViewInput } from "../libs/types/view";
import ProductModel from "../schema/Product.model";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import MemberModel from "../schema/Member.model";
class ProductService {
  private readonly productModel;
  public viewService;
  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      console.log("createNewProduct");
      const result = await this.productModel.create(input);
      return result;
    } catch (err) {
      console.log("Error, createNewProduct", err);
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);
    }
  }

  public async getAllProducts(): Promise<Product[]> {
    try {
      console.log("getAllProducts");
      const result = await this.productModel.find();
      return result;
    } catch (err) {
      console.log("Error, getAllProducts", err);
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    try {
      console.log("getProduct");
      const productId = shapeIntoMongooseObjectId(id);
      let result = await this.productModel
        .findOne({
          _id: productId,
          productStatus: ProductStatus.PAUSE,
        })
        .exec();

      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (memberId) {
        const input: ViewInput = {
          viewGroup: ViewGroup.PRODUCT,
          viewRefId: productId,
          memberId: memberId,
        };

        const existView = await this.viewService.checkView(input);
        console.log("exist:", !!existView);
        if (!existView) {
          console.log("PLANNING TO INSERT NEW VIEW");
          await this.viewService.insertProductView(input);

          result = await this.productModel.findByIdAndUpdate(
            productId,
            {
              $inc: { productViews: +1 },
            },
            { new: true }
          );
        }
      }
      return result;
    } catch (err) {
      console.log("Error, getProduct", err);
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }
}

export default ProductService;
