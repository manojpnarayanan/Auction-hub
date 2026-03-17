import { IDomainEvent } from "../events/IDomainEvent";

export interface IEventEmitter {
    dispatch(event: IDomainEvent): void;
    // We will use specialized handlers, but the interface needs to emit
}
