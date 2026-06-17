import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import {
  Status_ACTIVE_LOCKED,
  Book_Status,
} from '../../common/enums/status.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('books')
  getAllBooks() {
    return this.adminService.getAllBooks();
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: Status_ACTIVE_LOCKED,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Patch('books/:id/status')
  updateBookStatus(
    @Param('id') id: string,
    @Body('status') status: Book_Status,
  ) {
    return this.adminService.updateBookStatus(id, status);
  }
}
