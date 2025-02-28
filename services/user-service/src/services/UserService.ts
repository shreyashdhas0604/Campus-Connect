import { User } from "../models/User";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from "../utils/logger";

export class UserService{
private prisma: PrismaClient;
    constructor(){
        this.prisma = new PrismaClient();
    }

    public async healthCheck(): Promise<ApiResponse>{
        try {
            return new ApiResponse(true, "User Service is up and running", 200, null);
        } catch (error) {
            logger('\nError in UserService.ts healthCheck(): ' + error);
            return new ApiResponse(false, "Error in health check", 500, null);
        }
    }

    public async createUser(user: any): Promise<ApiResponse>{
        try {
            const userData = user ;
            if(!userData){
                return new ApiResponse(false, "Invalid user data", 400, null);
            }
            const prevuser = await this.prisma.user.findUnique({
                where: {
                    email: userData.email
                }
            });
            if(prevuser){
                return new ApiResponse(false, "User already exists", 400, null);
            }
            const salt = bcryptjs.genSaltSync(10);
            userData.password = bcryptjs.hashSync(userData.password, salt);
            const newUser = await this.prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    username: userData.username,
                    password: userData.password,
                    role: userData.role,
                    emailVerified: false,
                    otp: null,
                    department : userData.department,
                    year : userData.year,
                    division : userData.division
                }
            });
            if(!newUser){
                return new ApiResponse(false, "Error in creating user", 500, newUser);
            }
            const newuser = {
                ...newUser,
                password: false
            }
            return new ApiResponse(true, "User created successfully", 201, newuser);
        } catch (error) {
            console.log('\nError in UserService.ts createUser(): ' + error);
            logger('\nError in UserService.ts createUser(): ' + error);
            return new ApiResponse(false, "Error in creating user", 500, null);
        }
    }

    public async getUsers(): Promise<ApiResponse>{
        try {
            const users = await this.prisma.user.findMany();
            if(!users){
                return new ApiResponse(false, "No users found", 404, null);
            }
            return new ApiResponse(true, "All Users found", 200, users);
        } catch (error) {
            logger('\nError in UserService.ts getUsers(): ' + error);
            return new ApiResponse(false, "Error in fetching users", 500, null);
        }
    }

    public async getUserById(id: number): Promise<ApiResponse>{
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            if(!user){
                return new ApiResponse(false, "No user found", 404, null);
            }
            return new ApiResponse(true, "User found", 200, user);
        } catch (error) {
            logger('\nError in UserService.ts getUserById(): ' + error);
            return new ApiResponse(false, "Error in fetching user", 500, null);
        }
    }

    public async updateEmailVerifiedStatus(userId: number, emailVerified: boolean): Promise<ApiResponse>{
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    emailVerified: emailVerified
                }
            });
            if(!user){
                return new ApiResponse(false, "No user found", 404, null);
            }

            return new ApiResponse(true, "Email verified status updated", 200, user
            );

        } catch (error) {
            logger('\nError in UserService.ts updateEmailVerifiedStatus(): ' + error);
            return new ApiResponse(false, "Error in updating email verified status", 500, null);
        }
    }

    public async updateOtp(userId: number, otp: number): Promise<ApiResponse>{
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    otp: otp
                }
            });
            if(!user){
                return new ApiResponse(false, "No user found", 404, null);
            }
            return new ApiResponse(true, "OTP updated", 200, user);
        } catch (error) {
            logger('\nError in UserService.ts updateOtp(): ' + error);
            return new ApiResponse(false, "Error in updating OTP", 500, null);
        }
    }

    public async deleteUser(userId: number): Promise<ApiResponse>{
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: userId
                }
            });
            if(!user){
                return new ApiResponse(false, "No user found", 404, null);
            }
            return new ApiResponse(true, "User deleted", 200, user);

        } catch (error) {
            logger('\nError in UserService.ts deleteUser(): ' + error);
            return new ApiResponse(false, "Error in deleting user", 500, null);
        }
    }
   
    public async deleteAllUsers(): Promise<ApiResponse>{
        try {
            const users = await this.prisma.user.deleteMany();
            if(!users){
                return new ApiResponse(false, "No users found", 404, null);
            }
            return new ApiResponse(true, "All Users deleted", 200, users);
        } catch (error) {
            logger('\nError in UserService.ts deleteAllUsers(): ' + error);
            return new ApiResponse(false, "Error in deleting users", 500, null);
        }
    }
    
    public async loginUser(email: string, password: string): Promise<ApiResponse>{
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if(!user){
                return new ApiResponse(false, "User not found", 404, null);
            }
            const validPassword = bcryptjs.compareSync(password, user.password);
            if(!validPassword){
                return new ApiResponse(false, "Invalid password", 400, null);
            }
            const secret = process.env.JWT_SECRET;
            if(!secret){
                return new ApiResponse(false, "Error in generating token", 500, null);
            }
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            };
            const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });

            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if(!refreshSecret){
                return new ApiResponse(false, "Error in generating token", 500, null);
            }

            const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

            const refreshTokenData = await this.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id
                }
            });
            if(!refreshTokenData){
                return new ApiResponse(false, "Error in logging in", 500, null);
            }
            return new ApiResponse(true, "User logged in", 200, { accessToken, refreshToken });
        } catch (error) {
            logger('\nError in UserService.ts loginUser(): ' + error);
            return new ApiResponse(false, "Error in logging in", 500, null);
        }
    }

    public async checkAlreadyLoggedIn(accessToken: string, refreshToken: string): Promise<boolean>{
        try {
            if(!accessToken || !refreshToken){
                return false;
            }
            const secret = process.env.JWT_SECRET;
            if(!secret){
                return false;
            }
            const decoded = jwt.verify(accessToken, secret);
            if(!decoded){
                return false;
            }
            return true;
        } catch (error) {
            logger('\nError in UserService.ts checkAlreadyLoggedIn(): ' + error);
            return false;
        }
    }

    public async logoutUser(userId: number): Promise<ApiResponse>{
        try {
            const isdeleted = await this.prisma.refreshToken.deleteMany({
                where: {
                    userId: userId
                }
            });
            if(!isdeleted){
                return new ApiResponse(false, "User not logged in", 400, null);
            }
            return new ApiResponse(true, "User logged out", 200, null);
        } catch (error) {
            logger('\nError in UserService.ts logoutUser(): ' + error);
            return new ApiResponse(false, "Error in logging out", 500, null);
        }
    }

    public async refreshToken(refreshToken: string): Promise<ApiResponse>{
        try {
            if(!refreshToken){
                return new ApiResponse(false, "No Refresh Token found", 400, null);
            }
            const refreshSecret = process.env.JWT_REFRESH_SECRET;
            if(!refreshSecret){
                return new ApiResponse(false, "JWT Refresh Secret is not defined", 500, null);
            }
            const decoded = jwt.verify(refreshToken, refreshSecret);
            if(!decoded){
                return new ApiResponse(false, "Invalid Refresh Token", 400, null);
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: (decoded as jwt.JwtPayload).user?.id
                }
            });
            if(!user){
                return new ApiResponse(false, "User not found", 400, null);
            }
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                }
            };
            const secret = process.env.JWT_SECRET;
            if(!secret){
                return new ApiResponse(false, "JWT Secret is not defined", 500, null);
            }
            const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
            return new ApiResponse(true, "Token refreshed", 200, { accessToken });
        } catch (error) {
            logger('\nError in UserService.ts refreshToken(): ' + error);
            return new ApiResponse(false, "Error in refreshing token", 500, null);
        }
    }

}