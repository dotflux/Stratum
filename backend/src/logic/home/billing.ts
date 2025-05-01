import { Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import * as validator from 'validator';

dotenv.config();

export const billing = async (
  req: Request,
  tierKey: string,
  userService: UserService,
) => {
  try {
    const token = req.cookies?.user_token; // Extract token from cookies

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    if (!decoded?.id) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await userService.findById(decoded?.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (tierKey === user.tier) {
      throw new BadRequestException('That is your current plan');
    }
    if (tierKey !== 'free' && tierKey !== 'pro' && tierKey !== 'elite') {
      throw new BadRequestException('Invalid tierkey');
    }
    if (tierKey === 'free') {
      throw new BadRequestException('Cant downgrade your plan');
    }

    const tierRank: Record<string, number> = {
      free: 1,
      pro: 2,
      elite: 3,
    };

    const userTierRank = tierRank[user.tier];
    const requestedTierRank = tierRank[tierKey];

    if (requestedTierRank <= userTierRank) {
      throw new BadRequestException(
        'You already own this tier or a higher one',
      );
    }

    const price = {
      free: 0,
      pro: 5000,
      elite: 10000,
    };

    const tierPrice = price[tierKey as keyof typeof price];

    if (user.strats < tierPrice) {
      throw new BadRequestException('You cant afford that transaction');
    }

    user.strats -= tierPrice;
    user.tier = tierKey;
    user.save();

    return {
      valid: true,
      message: 'plan changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in plan change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
