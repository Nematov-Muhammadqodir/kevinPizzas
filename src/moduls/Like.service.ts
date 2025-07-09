import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Like } from "../libs/types/like";
import LikeModel from "../schema/Like.model";
import { ObjectId } from "mongoose";
import MemberModel from "../schema/Member.model";
import ProductModel from "../schema/Product.model";
import { Product } from "../libs/types/product";

class LikeService {
  private readonly likeModel;
  private readonly productModel;

  constructor() {
    this.likeModel = LikeModel;
    this.productModel = ProductModel;
  }

  public async toggleLike(
    memberId: ObjectId,
    likeRefId: ObjectId
  ): Promise<{ like: true | false; likeRefId: ObjectId }> {
    const search: T = {
      memberId: memberId,
      likeRefId: likeRefId,
    };
    console.log("search object", search);

    const exists = await this.likeModel.findOne(search).exec();
    console.log("exists like", exists);
    if (exists) {
      await this.likeModel.findOneAndDelete(search).exec();
      await this.productModel
        .findByIdAndUpdate(
          { _id: likeRefId },
          { $inc: { productLikes: -1 } },
          { new: true }
        )
        .exec();
      return { like: false, likeRefId: likeRefId };
    } else {
      try {
        await this.likeModel.create(search);
        await this.productModel
          .findByIdAndUpdate(
            { _id: likeRefId },
            { $inc: { productLikes: 1 } },
            { new: true }
          )
          .exec();
        return { like: true, likeRefId: likeRefId };
      } catch (err) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
    }
  }

  //^ GET ALL USER LIKED PRODUCTS
  public async getLikedProducts(memberId: ObjectId): Promise<Product[]> {
    const likedProducts = await this.likeModel.aggregate([
      {
        $match: {
          memberId: memberId,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "likeRefId",
          foreignField: "_id",
          as: "myLikedProduct",
        },
      },
      { $unwind: "$myLikedProduct" }, // optional, depends if you want array or object
      {
        $replaceRoot: { newRoot: "$myLikedProduct" }, // optional: make the result only the product
      },
    ]);
    console.log("Liked Products", likedProducts);
    return likedProducts;
  }
}

export default LikeService;
