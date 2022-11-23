import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    MongooseModule.forRoot(`${process.env.MONGO_CONNECTION}`),
    UsersModule,
    KeywordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
