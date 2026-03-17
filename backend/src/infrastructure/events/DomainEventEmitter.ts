import { injectable } from "inversify";
import { EventEmitter } from "events";
import { IEventEmitter } from "../../domain/interfaces/IEventEmitter";
import { IDomainEvent } from "../../domain/events/IDomainEvent";

@injectable()
export class DomainEventEmitter extends EventEmitter implements IEventEmitter {
    constructor() {
        super();
    }

    dispatch(event: IDomainEvent): void {
        const eventName=event.constructor.name;
        // We use the constructor name as the event name (e.g., "BidPlacedEvent")
        super.emit(eventName, event);
    }
}
