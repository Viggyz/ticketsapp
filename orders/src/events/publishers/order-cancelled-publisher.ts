import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@ticketingpack/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
