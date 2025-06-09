import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { PasswordResetController } from '../controllers/PasswordResetController';
import { authenticateAdmin,authenticateToken } from '../utils/middleware';
import { uploadImage } from '../utils/middleware';

const userController = new UserController();
const passwordResetController = new PasswordResetController();
const router = Router(); 
//base url = http://localhost:8085/user/
// Define your routes here
router.get('/health', userController.healthCheck.bind(userController));
router.get('/users', userController.getUsers.bind(userController));
router.get('/user/:id', authenticateToken, userController.getUser.bind(userController));
router.get('/profile', authenticateToken, userController.getProfile.bind(userController));
// router.put('/update-profile', authenticateToken, userController.updateProfile.bind(userController));
router.post('/register-user', userController.createUser.bind(userController));
router.put('/update-profile', authenticateToken,uploadImage, userController.updateProfile.bind(userController));
router.delete('/delete-user/:id', authenticateToken, userController.deleteUser.bind(userController));
router.put('/update-email/:id', authenticateToken, authenticateAdmin, userController.updateEmailVerifiedStatus.bind(userController));
router.put('/update-otp/:id', authenticateToken, authenticateAdmin, userController.updateOtp.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController));
router.post('/logout/:id', userController.logoutUser.bind(userController));
router.get('/request-otp/:id', authenticateToken,userController.requestOtp.bind(userController));
router.post('/verify-otp/:id', authenticateToken,userController.verifyOtp.bind(userController));

// Password reset routes
router.post('/request-password-reset', passwordResetController.requestPasswordReset.bind(passwordResetController));
router.post('/verify-reset-token', passwordResetController.verifyResetToken.bind(passwordResetController));
router.post('/reset-password', passwordResetController.resetPassword.bind(passwordResetController));

export default router;