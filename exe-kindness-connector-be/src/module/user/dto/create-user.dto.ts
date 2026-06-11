import { UserRole } from 'src/common/enums/role.enum';
import { Status_ACTIVE_LOCKED } from 'src/common/enums/status.enum';

export class CreateUserDto {
  email!: string;
  password!: string;
  fullName!: string;
  role?: UserRole;
  status?: Status_ACTIVE_LOCKED;
  avatar?: string;
}
