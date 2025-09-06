import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { UserRegisteredEventData } from "../user-events.service";


@Injectable()
export class UserRegisteredEventListener {

    private readonly logger = new Logger(UserRegisteredEventListener.name);

    @OnEvent('user.registered')
    handleUserRegisteredEvent(event:UserRegisteredEventData) {
        const {user,timestamp} = event;
        this.logger.log(`Welcome,${user.email}! Your Account created at ${timestamp.toISOString()}`);
    }
}