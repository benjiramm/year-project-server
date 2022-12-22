import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class KeywordParamGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const { keyword } = req.query;

      if (!keyword) {
        throw new NotFoundException({ message: 'Search param not found' });
      }

      return true;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
