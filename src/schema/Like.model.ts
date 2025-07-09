import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    likeRefId: {
      type: Schema.Types.ObjectId,
    },
    memberId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Like", likeSchema);
