import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, data: {
    title: string;
    content: string;
    anonymous?: boolean;
    tags?: string;
  }) {
    return this.prisma.communityPost.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        anonymous: data.anonymous || false,
        tags: data.tags,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async getFeed(page: number = 1, limit: number = 20, tag?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (tag) where.tags = { contains: tag };

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
          _count: { select: { comments: true } },
        },
      }),
      this.prisma.communityPost.count({ where }),
    ]);

    const sanitizedPosts = posts.map((post) => {
      if (post.anonymous) {
        return { ...post, user: { id: post.user.id, name: 'Anonymous', avatar: null } };
      }
      return post;
    });

    return { posts: sanitizedPosts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPost(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.anonymous) {
      return { ...post, user: { id: post.user.id, name: 'Anonymous', avatar: null } };
    }

    return post;
  }

  async updatePost(id: string, userId: string, data: any) {
    const post = await this.prisma.communityPost.findFirst({
      where: { id, userId },
    });

    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    return this.prisma.communityPost.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.communityPost.findFirst({
      where: { id, userId },
    });

    if (!post) {
      throw new NotFoundException('Post not found or not authorized');
    }

    await this.prisma.communityPost.delete({ where: { id } });
    return { message: 'Post deleted' };
  }

  async upvotePost(id: string) {
    return this.prisma.communityPost.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
  }

  async createComment(postId: string, userId: string, content: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: { postId, userId, content },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, userId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found or not authorized');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Comment deleted' };
  }
}
