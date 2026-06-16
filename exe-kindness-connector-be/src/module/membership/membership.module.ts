import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { User, UserSchema } from '../user/entities/user.entity';
import { Membership, MembershipSchema } from './entities/membership.entity';
import { MembershipRecord, MembershipRecordSchema } from '../membership_record/entities/membership_record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: MembershipRecord.name, schema: MembershipRecordSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule { }
