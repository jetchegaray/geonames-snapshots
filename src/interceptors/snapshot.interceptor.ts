import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import * as archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SnapshotInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    const shouldSnapshot = request.headers['x-snapshot'] === 'true';

    const endpointName =
      context.getClass().name + '.' + context.getHandler().name;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${
      currentDate.getMonth() + 1
    }_${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}`;
    const zipFileName = `${endpointName}_${formattedDate}_${formattedTime}.zip`;

    const archive = archiver('zip', { zlib: { level: 9 } });

    return next.handle().pipe(
      tap((data) => {
        response.attachment(zipFileName);
        response.header('Content-Type', 'application/zip');

        archive.pipe(response);

        //        console.log(JSON.stringify(data, null, 2));
        const jsonData = JSON.stringify(data);
        archive.append(fs.createReadStream(data), { name: 'data.json' });
        archive.finalize();
      }),
    );
  }
}
