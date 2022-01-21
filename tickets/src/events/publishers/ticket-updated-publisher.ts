import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketingpack/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
