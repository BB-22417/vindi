import { Controller, Get, Post, Body, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as fs from 'fs';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.reportsService.findAll(userId);
  }

  @Post('generate')
  generate(
    @CurrentUser('id') userId: string,
    @Body() body: { format: 'PDF' | 'CSV'; dateRange?: { start: string; end: string } },
  ) {
    return this.reportsService.generate(userId, body.format, body.dateRange);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Res() res: Response,
  ) {
    const { report, filePath } = await this.reportsService.download(id, userId);

    const filename = filePath.split('\\').pop() || filePath.split('/').pop();
    const ext = report.format === 'PDF' ? '.pdf' : '.csv';
    const contentType = report.format === 'PDF' ? 'application/pdf' : 'text/csv';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="vindi-report${ext}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
}
