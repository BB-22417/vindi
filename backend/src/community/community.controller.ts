import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('community')
@UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post('posts')
  createPost(
    @CurrentUser('id') userId: string,
    @Body() data: { title: string; content: string; anonymous?: boolean; tags?: string },
  ) {
    return this.communityService.createPost(userId, data);
  }

  @Get('feed')
  getFeed(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
  ) {
    return this.communityService.getFeed(page, limit, tag);
  }

  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.communityService.getPost(id);
  }

  @Patch('posts/:id')
  updatePost(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.communityService.updatePost(id, userId, data);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.communityService.deletePost(id, userId);
  }

  @Post('posts/:id/upvote')
  upvotePost(@Param('id') id: string) {
    return this.communityService.upvotePost(id);
  }

  @Post('posts/:id/comments')
  createComment(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.communityService.createComment(id, userId, content);
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.communityService.deleteComment(id, userId);
  }
}
