import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FakeService } from './fake.service';
import { FakeController } from './fake.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [FakeController],
  providers: [FakeService],
})
export class EventModule {}
