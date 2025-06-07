import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import bcryptjs from 'bcryptjs';
import logger from '../utils/logger';

export class PasswordResetService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async generateResetToken(email: string): Promise<ApiResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return new ApiResponse(false, "User not found", 404, null);
            }

            // Generate a random 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            
            // Save the OTP to the user record
            await this.prisma.user.update({
                where: { email },
                data: { otp }
            });

            return new ApiResponse(true, "Reset token generated successfully", 200, { email, otp });
        } catch (error) {
            logger('\nError in PasswordResetService.ts generateResetToken(): ' + error);
            return new ApiResponse(false, "Error generating reset token", 500, null);
        }
    }

    public async verifyResetToken(email: string, otp: number): Promise<ApiResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return new ApiResponse(false, "User not found", 404, null);
            }

            if (user.otp !== otp) {
                return new ApiResponse(false, "Invalid OTP", 400, null);
            }

            return new ApiResponse(true, "OTP verified successfully", 200, { email });
        } catch (error) {
            logger('\nError in PasswordResetService.ts verifyResetToken(): ' + error);
            return new ApiResponse(false, "Error verifying reset token", 500, null);
        }
    }

    public async resetPassword(email: string, newPassword: string): Promise<ApiResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return new ApiResponse(false, "User not found", 404, null);
            }

            const salt = bcryptjs.genSaltSync(10);
            const hashedPassword = bcryptjs.hashSync(newPassword, salt);

            await this.prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    otp: null
                }
            });

            return new ApiResponse(true, "Password reset successfully", 200, null);
        } catch (error) {
            logger('\nError in PasswordResetService.ts resetPassword(): ' + error);
            return new ApiResponse(false, "Error resetting password", 500, null);
        }
    }
}