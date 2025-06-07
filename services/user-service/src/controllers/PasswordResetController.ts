import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import { PasswordResetService } from '../services/PasswordResetService';
import logger from '../utils/logger';

export class PasswordResetController {
    private prisma: PrismaClient;
    private passwordResetService: PasswordResetService;

    constructor() {
        this.prisma = new PrismaClient();
        this.passwordResetService = new PasswordResetService();
    }

    public async requestPasswordReset(req: any, res: any) {
        try {
            const { email } = req.body;
            const result = await this.passwordResetService.generateResetToken(email);
            const { statusCode, ...responseData } = result;
            res.status(statusCode).json(responseData);
        } catch (error) {
            logger(`\nError in requestPasswordReset in PasswordResetController.ts: ${error}`);
            res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
        }
    }

    public async verifyResetToken(req: any, res: any) {
        try {
            const { email, otp } = req.body;
            const result = await this.passwordResetService.verifyResetToken(email, parseInt(otp));
            const { statusCode, ...responseData } = result;
            res.status(statusCode).json(responseData);
        } catch (error) {
            logger(`\nError in verifyResetToken in PasswordResetController.ts: ${error}`);
            res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
        }
    }

    public async resetPassword(req: any, res: any) {
        try {
            const { email, newPassword } = req.body;
            const result = await this.passwordResetService.resetPassword(email, newPassword);
            const { statusCode, ...responseData } = result;
            res.status(statusCode).json(responseData);
        } catch (error) {
            logger(`\nError in resetPassword in PasswordResetController.ts: ${error}`);
            res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
        }
    }
}