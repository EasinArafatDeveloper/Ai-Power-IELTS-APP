import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../database/repositories/user.repository';
import { UserDocument } from '../database/schemas/user.schema';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      if (getApps().length === 0) {
        initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'mock-project',
        });
        this.logger.log('Firebase Admin SDK initialized successfully.');
      }
    } catch (error: any) {
      this.logger.warn('Failed to initialize Firebase Admin SDK. Falling back to mock verification.', error.message);
    }
  }

  async loginWithFirebase(idToken: string): Promise<{ token: string; user: any }> {
    let firebaseUid: string;
    let email: string;
    let fullName: string;

    // Developer Mock Fallback
    if (idToken.startsWith('mock-token-')) {
      const parts = idToken.split('-');
      email = parts[2] || 'test@example.com';
      firebaseUid = `uid-${email.replace('@', '-')}`;
      fullName = email.split('@')[0];
      this.logger.log(`Performing mock authentication for user: ${email}`);
    } else {
      try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        firebaseUid = decodedToken.uid;
        email = decodedToken.email || '';
        fullName = (decodedToken as any).name || email.split('@')[0] || 'IELTS Student';
      } catch (error: any) {
        this.logger.error('Firebase token verification failed:', error.message);
        // If developer is using a mock credential check
        if (process.env.FIREBASE_PROJECT_ID === 'mock-project') {
          this.logger.warn('Token verification failed, but mock project is active. Creating simulated user session.');
          email = 'mockuser@example.com';
          firebaseUid = 'mock-uid-12345';
          fullName = 'Mock Student';
        } else {
          throw new UnauthorizedException('Authentication failed: Invalid Firebase Token');
        }
      }
    }

    if (!email) {
      throw new UnauthorizedException('Email is required for registering an account');
    }

    // Find or create user in MongoDB
    let user = await this.userRepository.findOne({ firebaseUid });
    if (!user) {
      // Check if user with this email already exists
      user = await this.userRepository.findOne({ email });
      if (user) {
        // Link firebaseUid
        user.firebaseUid = firebaseUid;
        await user.save();
      } else {
        // Create new user
        user = await this.userRepository.create({
          firebaseUid,
          email,
          fullName,
          targetBand: 6.5, // Default baseline target
          examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default 90 days from now
          onboardingCompleted: false,
          assessmentCompleted: false,
          streakCount: 1,
          lastActive: new Date(),
        });
      }
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      firebaseUid: user.firebaseUid,
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
