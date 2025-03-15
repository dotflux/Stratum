import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DummyUser, DummyUserSchema } from 'src/models/dummyUser.schema';
import { DummyUserService } from 'src/services/dummyUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DummyUser.name, schema: DummyUserSchema },
    ]),
  ],
  exports: [DummyUserService],
  providers: [DummyUserService],
})
export class DummyUserModule {}
