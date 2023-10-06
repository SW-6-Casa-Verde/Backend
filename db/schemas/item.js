import { Schema } from "mongoose";
import itemId from "./types/short-id";

const ItemSchema = new Schema(
  {
    id: itemId,
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    main_image: {
      // 대표 이미지
      type: [
        {
          data: Buffer,
          contentType: String,
        },
      ],
      required: true,
    },
    images: [String], // 상세 이미지(옵션)
    category: {
      // id만 가져오는 게 아니라 오브젝트 자체를 가져오니까 그냥 "category"가 맞을 것 같아요!
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export { ItemSchema };
