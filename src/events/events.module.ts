import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './user-events.service';
import { UserRegisteredEventListener } from './listeners/user-registered.listener';

@Module({
    imports:[
        EventEmitterModule.forRoot({
            global:true,
            wildcard:false,
            maxListeners:20,
            verboseMemoryLeak:true
        })
    ],
    providers:[UserEventsService,UserRegisteredEventListener],
    exports:[UserEventsService]
})
export class EventsModule {}
