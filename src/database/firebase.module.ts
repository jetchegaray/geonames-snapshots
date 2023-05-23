import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { FirebaseService } from './firebase.service';

const firebaseProvider = {
  provide: 'FirebaseAdmin',
  useFactory: async (configService: ConfigService) => {
    const adminFirebaseConfig: ServiceAccount = {
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      privateKey: configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    //initialize firebase
    const firebaseApp: admin.app.App = admin.initializeApp({
      credential: admin.credential.cert(adminFirebaseConfig),
      databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
    });
    return firebaseApp;
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
