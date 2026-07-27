import { Injectable, UnauthorizedException, Logger, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/repositories/user.repository';
import { UserDocument } from '../database/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string): Promise<{ token: string; user: any }> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
      targetBand: 6.5, // Default baseline target
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default 90 days from now
      onboardingCompleted: false,
      assessmentCompleted: false,
      streakCount: 1,
      lastActive: new Date(),
    });

    return this.generateAuthResponse(user);
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    // Developer Sandbox Bypass (for testing)
    if (email.startsWith('dev@')) {
      const user = await this.userRepository.findOne({ email });
      if (user) {
        return this.generateAuthResponse(user);
      }
    }

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    return this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: UserDocument) {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        targetBand: user.targetBand,
        examDate: user.examDate,
        onboardingCompleted: user.onboardingCompleted,
        assessmentCompleted: user.assessmentCompleted,
        streakCount: user.streakCount,
      },
    };
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userRepository.findById(userId);
  }
}
