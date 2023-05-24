import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

@Injectable()
export class ZipService {
  getArchiver = async (jsonData: string): Promise<archiver.Archiver> => {
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Append JSON data to the zip
    archive.append(jsonData, { name: 'data.json' });

    // Finalize the zip and send the response
    await archive.finalize();
    return archive;
  };

  getFileName = (endpoint: string) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${
      currentDate.getMonth() + 1
    }_${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}`;
    return `${endpoint}_${formattedDate}_${formattedTime}`;
  };
}
