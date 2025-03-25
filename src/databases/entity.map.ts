import { UserEntity } from 'src/users/entities/user.entity';
import { DatabaseEnum } from 'src/shared/enums/database.enum';

export const entityMap: Record<DatabaseEnum, any[]> = {
  [DatabaseEnum.POSTGRES]: [UserEntity],
};
