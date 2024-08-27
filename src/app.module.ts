import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('connected to mongoDB');
        });
        connection._events.connected();
        return connection;
      },
    }),

    UsersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
