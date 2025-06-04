import { ObjectId } from "mongoose";
import { OrderStatus } from "../enums/order.enum";

export interface OrderItem {
  _id: ObjectId;
  itemQuantity: number;
  itemPrice: number;

  orderId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: ObjectId;
  memberId: ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;

  createdAt: Date;
  updatedAt: Date;
}
export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: ObjectId;

  orderId?: ObjectId;
}

export interface OrderInquery {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: ObjectId;
  orderStatus: OrderStatus;
}
