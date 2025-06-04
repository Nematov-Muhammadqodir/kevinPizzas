import { ObjectId } from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Member } from "../libs/types/member";
import {
  Order,
  OrderInquery,
  OrderItem,
  OrderItemInput,
} from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((acc: number, curItem: OrderItemInput) => {
      return acc + curItem.itemPrice * curItem.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;

    const orderInput = {
      memberId: memberId,
      orderTotal: amount + delivery,
      orderDelivery: delivery,
    };

    try {
      const order = await this.orderModel.create(orderInput);
      //TODO: create order items
      const orderId = order._id;
      await this.recordOrderItem(orderId, input);
      return order;
    } catch (err) {
      console.log("Error, createOrder", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(
    orderId: ObjectId,
    orderItem: OrderItemInput[]
  ): Promise<void> {
    try {
      console.log("recordOrderItem");
      const promisedList = orderItem.map(async (item: OrderItemInput) => {
        item.orderId = orderId;
        item.productId = shapeIntoMongooseObjectId(item.productId);
        await this.orderItemModel.create(item);
        return "Inserted";
      });

      const orderItemState = await Promise.all(promisedList);
      console.log("orderItemState", orderItemState);
    } catch (err) {
      console.log("Error, recordOrderItem", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getMyOrders(
    member: Member,
    orderInquery: OrderInquery
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const match = { orderStatus: orderInquery.orderStatus, memberId: memberId };

    try {
      const result = await this.orderModel
        .aggregate([
          { $match: match },
          { $sort: { updatedAt: -1 } },
          { $skip: (orderInquery.page - 1) * orderInquery.limit },
          { $limit: orderInquery.limit },
          {
            $lookup: {
              from: "orderItems",
              localField: "_id",
              foreignField: "orderId",
              as: "orderItems",
            },
          },

          {
            $lookup: {
              from: "products",
              localField: "orderItems.productId",
              foreignField: "_id",
              as: "productData",
            },
          },
        ])
        .exec();

      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result;
    } catch (err) {
      console.log("Error, getMyOrders", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default OrderService;
