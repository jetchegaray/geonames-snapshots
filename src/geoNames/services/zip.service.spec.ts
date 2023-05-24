import { Test } from '@nestjs/testing';
import * as archiver from 'archiver';
import { ZipService } from './zip.service';

describe('ZipService', () => {
  let zipService: ZipService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ZipService],
    }).compile();

    zipService = moduleRef.get<ZipService>(ZipService);
  });

  describe('getArchiver', () => {
    it('should create and finalize the archiver with the provided JSON data', async () => {
      const jsonData = '{"name": "John Doe"}';

      const archive: archiver.Archiver = await zipService.getArchiver(jsonData);

      expect(archive).toBeDefined();

      // TODO: Add more assertions
    });
  });

  describe('getFileName', () => {
    it('should return a formatted file name based on the endpoint and current date/time', () => {
      const endpoint = 'users';

      const fileName: string = zipService.getFileName(endpoint);

      expect(fileName).toMatch(
        /users_\d{1,2}_\d{1,2}_\d{4}_\d{1,2}_\d{1,2}_\d{1,2}/,
      );
    });
  });
});
