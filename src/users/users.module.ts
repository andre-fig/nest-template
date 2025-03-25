import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DatabaseEnum } from 'src/shared/enums/database.enum';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], DatabaseEnum.POSTGRES)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
