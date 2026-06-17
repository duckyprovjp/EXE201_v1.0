import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { BookModule } from './module/book/book.module';
import { LocationModule } from './module/location/location.module';
import { BookCategoryModule } from './module/book-category/book-category.module';
import { ExchangeRequestModule } from './module/exchange_request/exchange_request.module';
import { ExchangeRecordModule } from './module/exchange_record/exchange_record.module';
import { ConversationModule } from './module/conversation/conversation.module';
import { MessageModule } from './module/message/message.module';
import { MessageStatusModule } from './module/message_status/message_status.module';
import { MembershipModule } from './module/membership/membership.module';
import { MembershipRecordModule } from './module/membership_record/membership_record.module';
import { BookViolationModule } from './module/book_violation/book_violation.module';
import { BookViolationRecordModule } from './module/book_violation_record/book_violation_record.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './module/auth/auth.module';
import { ExchangeModule } from './module/exchange/exchange.module';
import { ChatModule } from './module/chat/chat.module';
import { AdminModule } from './module/admin/admin.module';
import { ReviewModule } from './module/review/review.module';

@Module({
  imports: [
    UserModule,
    BookModule,
    LocationModule,
    BookCategoryModule,
    ExchangeRequestModule,
    ExchangeRecordModule,
    ConversationModule,
    MessageModule,
    MessageStatusModule,
    MembershipModule,
    MembershipRecordModule,
    BookViolationModule,
    BookViolationRecordModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://cuongndhe180335_db_user:nodaco35@kindness-connector.ghvcoe7.mongodb.net/kindness-connector',
    ),
    AuthModule,
    ExchangeModule,
    ChatModule,
    AdminModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
