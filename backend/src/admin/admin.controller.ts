import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getUsers(
    @CurrentUser('id') adminId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getUsers(adminId, page, limit);
  }

  @Get('analytics')
  getAnalytics(@CurrentUser('id') adminId: string) {
    return this.adminService.getAnalytics(adminId);
  }

  @Get('revenue')
  getRevenue(@CurrentUser('id') adminId: string) {
    return this.adminService.getRevenue(adminId);
  }

  @Post('content/moderate')
  moderateContent(
    @CurrentUser('id') adminId: string,
    @Body() body: { postId: string; action: string },
  ) {
    return this.adminService.moderateContent(adminId, body.postId, body.action);
  }
}
