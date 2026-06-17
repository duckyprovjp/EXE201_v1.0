import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipRecordService } from './membership_record.service';
import { CreateMembershipRecordDto } from './dto/create-membership_record.dto';
import { UpdateMembershipRecordDto } from './dto/update-membership_record.dto';

@Controller('membership-record')
export class MembershipRecordController {
  constructor(
    private readonly membershipRecordService: MembershipRecordService,
  ) {}

  @Post()
  create(@Body() createMembershipRecordDto: CreateMembershipRecordDto) {
    return this.membershipRecordService.create(createMembershipRecordDto);
  }

  @Get()
  findAll() {
    return this.membershipRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipRecordService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMembershipRecordDto: UpdateMembershipRecordDto,
  ) {
    return this.membershipRecordService.update(+id, updateMembershipRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipRecordService.remove(+id);
  }
}
