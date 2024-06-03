import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UsersIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const userIdFromRequest = request?.params?.userId;
      const userIdFromToken = request?.user.user_id;
      if (Number(userIdFromRequest) !== userIdFromToken) {
        throw new ForbiddenException(
          'You cannot access to other users records',
        );
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
