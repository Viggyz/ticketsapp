import { Publisher, Subjects, TicketCreatedEvent } from "@ticketingpack/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
