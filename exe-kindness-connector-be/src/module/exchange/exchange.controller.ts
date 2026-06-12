import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Exchange_Status } from '../../common/enums/status.enum';

@Controller('exchange')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  create(@Body() body: { bookId: string; ownerId: string }, @Req() req: any) {
    return this.exchangeService.create(req.user.userId, body.bookId, body.ownerId);
  }

  @Get()
  findAllForUser(@Req() req: any) {
    return this.exchangeService.findAllForUser(req.user.userId);
  }

  @Get('book/:bookId')
  findAllForBook(@Param('bookId') bookId: string, @Req() req: any) {
    return this.exchangeService.findAllForBook(bookId, req.user.userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: Exchange_Status,
    @Req() req: any,
  ) {
    return this.exchangeService.updateStatus(id, req.user.userId, status);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.exchangeService.cancelExchange(id, req.user.userId);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Req() req: any) {
    return this.exchangeService.completeExchange(id, req.user.userId);
  }
}
