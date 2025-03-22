import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseEnum } from 'src/shared/enums/database.enum';

@Module({
  imports: [TypeOrmModule.forFeature([User], DatabaseEnum.DEFAULT)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
