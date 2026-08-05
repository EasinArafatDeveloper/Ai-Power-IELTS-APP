import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'IELTS AI Backend API is running successfully!';
  }
}
