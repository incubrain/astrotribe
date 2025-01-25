import { Injectable } from '@nestjs/common'
import { Subject, Observable } from 'rxjs'

export interface PaymentEvent {
  type: 'created' | 'updated' | 'deleted'
  module: 'payment' | 'subscription'
  data: any
}

@Injectable()
export class PaymentEventsService {
  private eventSubject = new Subject<PaymentEvent>()

  emit(event: PaymentEvent) {
    this.eventSubject.next(event)
  }

  getEvents(): Observable<PaymentEvent> {
    return this.eventSubject.asObservable()
  }
}
