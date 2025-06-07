import { Department, PrismaClient, Year } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';
import { sendMessage } from '../kafka/producer';

export class UserSearchService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async searchUsers(searchParams: any): Promise<ApiResponse> {
        try {
            const {
                name,
                email,
                username,
                department,
                year,
                division,
                role,
                page = 1,
                limit = 10
            } = searchParams;

            const skip = (page - 1) * limit;

            // Build where clause based on provided search parameters
            const whereClause: any = {};
            if (name) whereClause.name = { contains: name, mode: 'insensitive' };
            if (email) whereClause.email = { contains: email, mode: 'insensitive' };
            if (username) whereClause.username = { contains: username, mode: 'insensitive' };
            if (department) whereClause.department = department;
            if (year) whereClause.year = year;
            if (division) whereClause.division = division;
            if (role) whereClause.role = role;

            // Get total count for pagination
            const totalCount = await this.prisma.user.count({
                where: whereClause
            });

            // Get paginated results
            const users = await this.prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    department: true,
                    year: true,
                    division: true,
                    role: true,
                    emailVerified: true,
                    profilePic: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            const totalPages = Math.ceil(totalCount / limit);

            await sendMessage("users-searched", {
                searchParams,
                resultCount: users.length,
                timestamp: new Date().toISOString()
            });
            return new ApiResponse(true, "Users found successfully", 200, {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            logger('\nError in UserSearchService.ts searchUsers(): ' + error);
            return new ApiResponse(false, "Error searching users", 500, null);
        }
    }

    public async searchUsersByDepartment(department: Department): Promise<ApiResponse> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    department: department
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    department: true,
                    year: true,
                    division: true,
                    role: true,
                    emailVerified: true,
                    profilePic: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false
                }
            });

            await sendMessage("users-filtered", {
                filterType: "department",
                department: department,
                resultCount: users.length,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, "Users found successfully", 200, users);
        } catch (error) {
            logger('\nError in UserSearchService.ts searchUsersByDepartment(): ' + error);
            return new ApiResponse(false, "Error searching users by department", 500, null);
        }
    }

    public async searchUsersByYear(year: Year): Promise<ApiResponse> {
        try {
            const users = await this.prisma.user.findMany({
                where: {
                    year: year
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    department: true,
                    year: true,
                    division: true,
                    role: true,
                    emailVerified: true,
                    profilePic: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false
                }
            });

            await sendMessage("users-filtered", {
                filterType: "year",
                year: year,
                resultCount: users.length,
                timestamp: new Date().toISOString()
            });
            return new ApiResponse(true, "Users found successfully", 200, users);
        } catch (error) {
            logger('\nError in UserSearchService.ts searchUsersByYear(): ' + error);
            return new ApiResponse(false, "Error searching users by year", 500, null);
        }
    }
}