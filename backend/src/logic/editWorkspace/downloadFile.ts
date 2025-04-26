import { Response } from 'express';
import { FileService } from 'src/services/file.service';
import { NotFoundException } from '@nestjs/common';
import { join } from 'path';

export const downloadFile = async (
  id: string,
  res: Response,
  fileService: FileService,
) => {
  const file = await fileService.findById(id);
  if (!file) {
    throw new NotFoundException('File not found');
  }

  const filePath = join(__dirname, '..', '..', file.path); // assuming `path` is relative to root
  return res.download(filePath, file.originalName);
};
