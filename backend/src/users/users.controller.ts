import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @CurrentUser() user?: any,
  ) {
    return this.usersService.findAll(page || 1, limit || 20, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    return this.usersService.update(id, data, user.id, user.role);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @CurrentUser() user: any,
  ) {
    return this.usersService.updateRole(id, role, user.id);
  }

  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser() user: any,
  ) {
    if (id !== user.id) {
      throw new Error('Cannot update another user profile');
    }
    return this.usersService.updateProfile(id, data);
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string, @CurrentUser() user: any) {
    if (id !== user.id) {
      return this.usersService.findOne(id);
    }
    return this.usersService.getProfile(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.usersService.remove(id, user.id, user.role);
  }
}
