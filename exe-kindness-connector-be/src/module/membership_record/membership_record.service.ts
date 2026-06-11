import { Injectable } from '@nestjs/common';
import { CreateMembershipRecordDto } from './dto/create-membership_record.dto';
import { UpdateMembershipRecordDto } from './dto/update-membership_record.dto';

@Injectable()
export class MembershipRecordService {
  create(createMembershipRecordDto: CreateMembershipRecordDto) {
    return 'This action adds a new membershipRecord';
  }

  findAll() {
    return `This action returns all membershipRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membershipRecord`;
  }

  update(id: number, updateMembershipRecordDto: UpdateMembershipRecordDto) {
    return `This action updates a #${id} membershipRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} membershipRecord`;
  }
}
