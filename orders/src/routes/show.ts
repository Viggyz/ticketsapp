import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ticketingpack/common";
import { param } from "express-validator";
import mongoose from "mongoose";

import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId is not valid"),
  ],
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // console.log(order);

    res.send(order);
  }
);

export { router as showOrderRouter };
