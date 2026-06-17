import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20, adminId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role === 'USER') {
      throw new ForbiddenException('Admin access required');
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          profile: true,
          subscription: {
            select: { plan: true, status: true },
          },
        },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        dateOfBirth: true,
        phone: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        subscription: {
          select: { plan: true, status: true, currentPeriodEnd: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: any, currentUserId: string, currentUserRole: string) {
    if (id !== currentUserId && currentUserRole === 'USER') {
      throw new ForbiddenException('Cannot update another user');
    }

    const allowedFields: any = {};
    if (data.name) allowedFields.name = data.name;
    if (data.phone) allowedFields.phone = data.phone;
    if (data.dateOfBirth) allowedFields.dateOfBirth = new Date(data.dateOfBirth);
    if (data.avatar) allowedFields.avatar = data.avatar;

    const user = await this.prisma.user.update({
      where: { id },
      data: allowedFields,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatar: true,
        dateOfBirth: true,
      },
    });

    return user;
  }

  async updateRole(userId: string, role: UserRole, adminId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can change roles');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: 'UPDATE_ROLE',
        details: { targetUserId: userId, newRole: role },
      },
    });

    return user;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: {
        timezone: data.timezone,
        height: data.height,
        weight: data.weight,
        birthYear: data.birthYear,
        menopauseStatus: data.menopauseStatus,
        symptomsStartedAt: data.symptomsStartedAt ? new Date(data.symptomsStartedAt) : undefined,
      },
      create: {
        userId,
        timezone: data.timezone,
        height: data.height,
        weight: data.weight,
        birthYear: data.birthYear,
        menopauseStatus: data.menopauseStatus,
        symptomsStartedAt: data.symptomsStartedAt ? new Date(data.symptomsStartedAt) : undefined,
      },
    });

    return profile;
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async remove(id: string, currentUserId: string, currentUserRole: string) {
    if (id !== currentUserId && currentUserRole === 'USER') {
      throw new ForbiddenException('Cannot delete another user');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
