import { IDomainEvent } from "../events/IDomainEvent";

export interface IEventEmitter {
    dispatch(event: IDomainEvent): void;
    
}
