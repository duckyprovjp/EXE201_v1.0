// membership.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, Headers, HttpCode } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) { }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  createCheckout(@Req() req: any, @Body() body: { successUrl?: string; errorUrl?: string; cancelUrl?: string }) {
    return this.membershipService.createCheckout(req.user.userId, body);
  }

  /**
   * Webhook endpoint cho SePay
   * QUAN TRỌNG: 
   * - Phải trả về HTTP 200 OK
   * - Response phải có dạng {"success": true}
   */
  @Post('webhook/sepay')  // Đổi tên để rõ ràng hơn
  @HttpCode(200)  // BẮT BUỘC: SePay yêu cầu HTTP 200
  async receiveSePayWebhook(
    @Body() payload: any,
    @Headers('x-sepay-signature') signature?: string,  // Nhận signature để xác thực
  ) {
    // Gọi service xử lý webhook
    const result = await this.membershipService.handleSePayWebhook(payload, signature);

    // Luôn trả về đúng format SePay yêu cầu
    return { success: true };
  }

  /**
   * Endpoint cũ để tương thích (có thể xóa sau)
   */
  @Post('webhook')
  @HttpCode(200)
  async receiveLegacyWebhook(@Body() payload: any) {
    // Chuyển hướng sang handler mới
    return this.receiveSePayWebhook(payload);
  }

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembershipDto: UpdateMembershipDto) {
    return this.membershipService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipService.remove(+id);
  }
}