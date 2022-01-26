import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@ticketingpack/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
