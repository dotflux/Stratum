// src/interceptors/file-upload.interceptor.ts

import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadInterceptor {
  static create() {
    return FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const workspaceId = req.params.id; // 'id' is accessed from the route parameters
          const uploadPath = `./uploads/${workspaceId}`;

          // Ensure that the directory exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath); // Proceed with the file upload to this path
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.originalname.split('.')[0]}-${unique}${ext}`);
        },
      }),
    });
  }
}
