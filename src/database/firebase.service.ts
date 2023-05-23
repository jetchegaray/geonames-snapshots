import { Injectable, Logger, Inject } from '@nestjs/common';
import { query } from 'express';
import * as admin from 'firebase-admin';
import { FullCountryDTO } from 'src/geoNames/dto/FullCountry';

@Injectable()
export class FirebaseService {
  private database: admin.database.Database;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    @Inject('FirebaseAdmin') private readonly firebaseApp: admin.app.App,
  ) {
    this.database = firebaseApp.database();
  }

  getSnapshot = async <T>(snapshotName: string): Promise<Record<string, T>> => {
    const snapshot: admin.database.DataSnapshot = await this.database
      .ref(snapshotName)
      .once('value');
    const countriesSnapshot: Record<string, T> = await snapshot.val();
    return countriesSnapshot;
  };

  getCountry = async <T>(
    snapshotName: string,
    ISO: string,
  ): Promise<Record<string, T>> => {
    const queryRef: admin.database.Reference = this.database.ref(snapshotName);
    this.logger.debug(ISO);
    const snapshot: admin.database.DataSnapshot = await queryRef
      .orderByChild('iso')
      .equalTo(ISO)
      .once('value');

    const countrySnapshot: Record<string, T> = await snapshot.val();
    return countrySnapshot;
  };

  setFullCountry = async (
    snapshotName: string,
    fullCountryDTO: FullCountryDTO,
  ): Promise<void> => {
    return this.database
      .ref(`${snapshotName}/${fullCountryDTO.iso}`)
      .set(fullCountryDTO);
  };

  getFullCountry = async <T>(
    snapshotName: string,
    ISO: string,
  ): Promise<Record<string, T>> => {
    const queryRef: admin.database.Reference = this.database.ref(snapshotName);
    this.logger.debug(ISO);
    const snapshot: admin.database.DataSnapshot = await queryRef
      .orderByKey()
      .equalTo(ISO)
      .once('value');

    const countrySnapshot: Record<string, T> = await snapshot.val();
    return countrySnapshot;
  };
}
