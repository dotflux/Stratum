import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DummyEmailChange,
  DummyEmailChangeSchema,
} from 'src/models/dummyEmailChange.schema';
import { DummyEmailChangeService } from 'src/services/dummyEmailChange.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DummyEmailChange.name, schema: DummyEmailChangeSchema },
    ]),
  ],
  exports: [DummyEmailChangeService],
  providers: [DummyEmailChangeService],
})
export class DummyEmailChangeModule {}
