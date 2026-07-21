import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';

export class FirebaseLoginDto {
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase-login')
  @HttpCode(HttpStatus.OK)
  async firebaseLogin(@Body() body: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(body.idToken);
  }
}
