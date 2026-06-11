import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Exchange, ExchangeSchema } from './entities/exchange.entity';
import { ChatModule } from '../chat/chat.module';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exchange.name, schema: ExchangeSchema },
      { name: User.name, schema: UserSchema }
    ]),
    ChatModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService],
})
export class ExchangeModule {}
