import { PrismaClient } from '@prisma/client';
import {ApiResponse} from '../utils/ApiResponse';
import logger from '../utils/logger';
import { UserService } from '../services/UserService';

export class UserController {
private prisma: PrismaClient;
private apiResponse: ApiResponse;
private userService: UserService;

  constructor() {
    this.prisma = new PrismaClient();
    this.apiResponse = new ApiResponse(false,'',400,null);
    this.userService = new UserService();
  }
  
  public async healthCheck(req: any, res: any) {
    try {
      const healthCheck = await this.userService.healthCheck();
      const { statusCode, ...healthCheckData } = healthCheck;
      res.status(statusCode).json(healthCheckData);
    } catch (error) {
      logger(`\nError in healthCheck  in userController.ts : ${error}`);
      res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
  }

  public async getUsers(req: any, res: any) {
    try {
        const users = await this.userService.getUsers();
        const { statusCode, ...userData } = users;
        res.status(statusCode).json(userData);
        
    } catch (error) {
      logger(`\nError in getUsers  in userController.ts : ${error}`);
      res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
    }
  }

public async getUser(req: any, res: any) {
  try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.getUserById(userId);
      const{statusCode,...userData} = user;
      res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in getUser  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}
 
public async createUser(req: any, res: any) {
  try {
    const userData = await this.userService.createUser(req.body);
    const { statusCode, ...user } = userData;
    res.status(statusCode).json(user);
  } catch (error) {
    logger(`\nError in createUser  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async updateEmailVerifiedStatus(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    const emailVerified = req.body.emailVerified;
    const user = await this.userService.updateEmailVerifiedStatus(userId,emailVerified);
    const { statusCode, ...userData } = user;
    res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in updateEmailVerifiedStatus  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async updateOtp(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    const otp = req.body.otp;
    const user = await this.userService.updateOtp(userId,otp);
    const { statusCode, ...userData } = user;
    res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in updateOtp  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data : null });
  }
}
 
public async deleteUser(req: any, res: any) {
  try {
      const userId = parseInt(req.params.id);
      const user = await this.userService.deleteUser(userId);
      const { statusCode, ...userData } = user;
      res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in deleteUser  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}  

public async deleteAllUsers(req: any, res: any) {
  try {
    const users = await this.userService.deleteAllUsers();
    const { statusCode, ...userData } = users;
    res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in deleteAllUsers  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async loginUser(req: any, res: any) {
  try {
      const checkAlreadyLoggedIn = await this.userService.checkAlreadyLoggedIn(req.cookies.accessToken,req.cookies.refreshToken);
      if(checkAlreadyLoggedIn){
        return res.status(400).json({ success: false, message: 'User already logged in', data: null });
      }
      const { email, password } = req.body ;
      const user = await this.userService.loginUser(email,password);
      const { statusCode, ...userData } = user;
      const accessToken = userData.data.accessToken;
      const refreshToken = userData.data.refreshToken;
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

      res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in loginUser  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async logoutUser(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    const user = await this.userService.logoutUser(userId);
    const { statusCode, ...userData } = user;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in logoutUser  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null }); 
  }
}

public async refreshToken(req: any, res: any) {
  try {
    const { refreshToken } = req.cookies;
    const getdata = await this.userService.refreshToken(refreshToken);
    const { statusCode, ...userData } = getdata;
    const accessToken = userData.data.accessToken;
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.status(statusCode).json(userData);
  } catch (error) {
    logger(`\nError in refreshToken  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async getProfile(req: any, res: any) {
  try {
    const userId = parseInt(req.user.id);
    const user = await this.userService.getProfile(userId);
    const { statusCode, ...userData } = user;
    res.status(statusCode).json(userData);
  } catch (error) {
    console.log(`\nError in getProfile  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async updateProfile(req: any, res: any) {
  try {
    const userId = parseInt(req.user.id);
    const data = {...req.body,profilePic:req.file};
    const user = await this.userService.updateProfile(userId,data);
    const { statusCode, ...userData } = user;
    res.status(statusCode).json(userData);
  } catch (error) {
    console.log(`\nError in updateProfile  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
}

public async requestOtp(req: any, res: any) {
  try {
    const userId = parseInt(req.params.id);
    const user = await this.userService.requestOtp(userId);
    const { statusCode,...userData } = user; 
    res.status(statusCode).json({ success: true, message: 'Otp sent successfully', data: null});
  } 
  catch (error) {
    console.log(`\nError in requestOtp  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null }); 
  }
}

public async verifyOtp(req: any, res: any) {
  try {
    const { otp } = req.body;
    const userId = parseInt(req.params.id);
    const otp1 = parseInt(otp);
    const user = await this.userService.verifyOtp(userId,otp1);
    const { statusCode,...userData } = user;
    res.status(statusCode).json({success: true,message: 'Otp verified successfully',data: userData});
  } catch (error){
    console.log(`\nError in verifyOtp  in userController.ts : ${error}`);
    res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  } 
}

}