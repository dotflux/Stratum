import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DummyResets, DummyResetsSchema } from 'src/models/dummyResets.schema';
import { DummyResetsService } from 'src/services/dummyResets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DummyResets.name, schema: DummyResetsSchema },
    ]),
  ],
  exports: [DummyResetsService],
  providers: [DummyResetsService],
})
export class DummyResetsModule {}
