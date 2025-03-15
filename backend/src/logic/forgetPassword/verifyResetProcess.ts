import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { DummyResetsService } from 'src/services/dummyResets.service';

dotenv.config();

export const verifyResetProcess = async (
  req: Request,
  dummyResetsService: DummyResetsService,
) => {
  try {
    const token = req.cookies?.passReset_token; // Extract token from cookies

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };

    if (!decoded?.email) {
      throw new UnauthorizedException('Invalid token');
    }

    const dummyUser = await dummyResetsService.findUserByEmail(decoded?.email);
    if (!dummyUser) {
      throw new UnauthorizedException('No such user in process');
    }

    return { valid: true, email: decoded.email };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in signup token validation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
