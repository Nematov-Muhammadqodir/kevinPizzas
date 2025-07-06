import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { Response } from "express";
import {
  OrderInquery,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import OrderService from "../moduls/Order.service";
import { OrderStatus } from "../libs/enums/order.enum";

const orderController: T = {};
const orderService = new OrderService();

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("controller: createOrder");
    const result = await orderService.createOrder(req.member, req.body);

    console.log("createdOrder", result);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error createOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("controller: createOrder");
    const { page, limit, orderStatus } = req.query;
    const orderInquery: OrderInquery = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };
    const result = await orderService.getMyOrders(req.member, orderInquery);
    console.log("getOrdeers data", result);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("orderController: updateOrder");
    const input: OrderUpdateInput = req.body;

    const result = await orderService.updateOrder(req.member, input);
    res.status(HttpCode.OK).send(result);
  } catch (err) {
    console.log("Error, updateOrder", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;
