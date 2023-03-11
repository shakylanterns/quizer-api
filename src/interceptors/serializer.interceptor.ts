import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface Constructible {
  new (...args: any[]): object;
}

export const Serializer = (dto: Constructible) => {
  return UseInterceptors(new SerializerInterceptor(dto));
};

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  async intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }
}
