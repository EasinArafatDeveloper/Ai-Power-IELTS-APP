import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { OnboardingDto } from './dtos/onboarding.dto';
import { PlacementTestDto } from './dtos/placement-test.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.usersService.getUserMe(user.userId);
  }

  @Patch('onboarding')
  async setupOnboarding(
    @CurrentUser() user: any,
    @Body() dto: OnboardingDto,
  ) {
    return this.usersService.completeOnboarding(user.userId, dto);
  }

  @Post('placement-test')
  async submitPlacement(
    @CurrentUser() user: any,
    @Body() dto: PlacementTestDto,
  ) {
    return this.usersService.completePlacementTest(user.userId, dto);
  }
}
