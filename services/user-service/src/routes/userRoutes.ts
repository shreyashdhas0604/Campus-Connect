import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateAdmin,authenticateToken } from '../utils/middleware';

const userController = new UserController();
const router = Router();

// Define your routes here
router.get('/health', userController.healthCheck.bind(userController));
router.get('/users', userController.getUsers.bind(userController));
router.get('/user/:id', authenticateToken, userController.getUser.bind(userController));
router.post('/register-user', authenticateToken, authenticateAdmin, userController.createUser.bind(userController));
router.put('/update-email/:id', authenticateToken, authenticateAdmin, userController.updateEmailVerifiedStatus.bind(userController));
router.put('/update-otp/:id', authenticateToken, authenticateAdmin, userController.updateOtp.bind(userController));
router.delete('/delete-user/:id', authenticateToken, authenticateAdmin, userController.deleteUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController));
router.post('/logout', userController.logoutUser.bind(userController));

export default router;