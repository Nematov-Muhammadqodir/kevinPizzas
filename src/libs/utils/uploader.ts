import { v4 } from "uuid";
import multer from "multer";
import path from "path";
import Errors from "../Errors";
import { HttpCode, Message } from "../Errors";

const getTargetImageStorage = (address: string) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${address}`);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
};

function makeUploader(address: any) {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
}

export default makeUploader;
