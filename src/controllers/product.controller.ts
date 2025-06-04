import Errors, { HttpCode, Message } from "../libs/Errors";
import { Request, Response } from "express";
import { T } from "../libs/types/common";
import ProductService from "../moduls/Product.service";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductInput } from "../libs/types/product";
import { MemberType } from "../libs/enums/member.enum";

const productService = new ProductService();
const productController: T = {};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    if (req.session.member.memberType !== MemberType.ADMIN)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    if (!req.files?.length)
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    const productInput: ProductInput = req.body;
    productInput.productImages = req.files.map((file) => {
      return file.path;
    });
    const result = await productService.createNewProduct(productInput);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, createNewProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getAllProducts = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllProducts");
    const result = await productService.getAllProducts();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const { productId } = req.params;
    const memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, productId);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
