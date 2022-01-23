import { Publisher, OrderCreatedEvent, Subjects } from "@ticketingpack/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
