import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      red: "Order",
    },
    productId: {
      type: Schema.Types.ObjectId,
      red: "Product",
    },
  },
  { timestamps: true, collection: "orderItems" }
);

export default mongoose.model("OrderItem", orderItemSchema);
