import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ticketingpack/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
