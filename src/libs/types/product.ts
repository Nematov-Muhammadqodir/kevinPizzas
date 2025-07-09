import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../enums/product.enum";

// export interface MeLiked {
//   memberId: ObjectId;
//   likeRefId: ObjectId;
//   myFavorite: boolean;
// }

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productIngredients: string;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: ProductVolume;
  productDesc?: string;
  productImages?: string;
  productViews: number;
  productLikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productIngredients: string;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: ProductVolume;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

export interface ProductInquery {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productSize?: ProductSize;
  productVolume?: ProductVolume;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
