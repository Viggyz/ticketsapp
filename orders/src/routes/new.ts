import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketingpack/common";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

// Could be a env
const EXPIRATION_WINDOWS_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new BadRequestError("Ticket doesn't exist");

    // Make sure ticket is not already reserved
    // Run query to look at all orderes. Find an order where ticket
    // is the ticket we just found *and* the order status is *not* cancalled.
    // If we find an order from that means the ticket *is* reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration time for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await order.save();

    // Publish an event that an order wqas created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
