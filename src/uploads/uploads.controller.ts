import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  UseGuards, 
  Body, 
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { File } from './entities/file.entity';
import { FileType } from './entities/file.entity';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: { type: 'string', enum: Object.values(FileType) },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        associatedEntity: { type: 'string' },
        entityType: { type: 'string' },
        visibility: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: File })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Req() req,
  ) {
    return this.uploadsService.uploadFile(file, uploadFileDto, req.user.id);
  }

  @Post('upload-from-url')
  @ApiOperation({ summary: 'Upload a file from URL' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: File })
  async uploadFromUrl(
    @Body() body: { url: string; uploadFileDto: UploadFileDto },
    @Req() req,
  ) {
    return this.uploadsService.uploadFromUrl(body.url, body.uploadFileDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user files' })
  @ApiResponse({ status: 200, description: 'List of user files', type: [File] })
  async getUserFiles(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: FileType,
  ) {
    return this.uploadsService.getUserFiles(req.user.id, page, limit, type);
  }

  @Get('storage-stats')
  @ApiOperation({ summary: 'Get user storage statistics' })
  @ApiResponse({ status: 200, description: 'Storage statistics' })
  async getStorageStats(@Req() req) {
    return this.uploadsService.getStorageStats(req.user.id);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get files by entity' })
  @ApiResponse({ status: 200, description: 'List of entity files', type: [File] })
  async getFilesByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.uploadsService.getFilesByEntity(entityType, entityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'File details', type: File })
  async getFile(@Param('id') id: string) {
    return this.uploadsService.getFileById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file' })
  @ApiResponse({ status: 200, description: 'File updated', type: File })
  async updateFile(
    @Param('id') id: string,
    @Body() updateData: Partial<File>,
    @Req() req,
  ) {
    return this.uploadsService.updateFile(id, updateData, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  async deleteFile(@Param('id') id: string, @Req() req) {
    return this.uploadsService.deleteFile(id, req.user.id);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Increment download count' })
  @ApiResponse({ status: 200, description: 'Download count incremented' })
  async incrementDownloadCount(@Param('id') id: string) {
    return this.uploadsService.incrementDownloadCount(id);
  }
}