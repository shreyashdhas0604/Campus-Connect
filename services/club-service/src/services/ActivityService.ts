import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';
import { sendMessage } from '../kafka/producer';

export class ActivityService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createActivity(clubId: number, activityData: any): Promise<ApiResponse> {
        try {
            // Validate club exists
            const club = await this.prisma.club.findUnique({
                where: { id: clubId }
            });

            if (!club) {
                return new ApiResponse(false, 'Club not found', 404, null);
            }

            const activity = await this.prisma.activity.create({
                data: {
                    ...activityData,
                    clubId,
                    status: 'PENDING'
                }
            });

            await sendMessage('activity-created', {
                activityId: activity.id,
                clubId: activity.clubId,
                title: activity.title,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Activity created successfully', 201, activity);
        } catch (error) {
            logger('\nError in ActivityService.ts createActivity(): ' + error);
            return new ApiResponse(false, 'Error creating activity', 500, null);
        }
    }

    public async getClubActivities(clubId: number, page?: number, limit?: number): Promise<ApiResponse> {
        try {
            const skip = page && limit ? (page - 1) * limit : undefined;
            const take = limit || undefined;

            const activities = await this.prisma.activity.findMany({
                where: { clubId },
                orderBy: { startDate: 'asc' },
                skip,
                take
            });

            return new ApiResponse(true, 'Activities fetched successfully', 200, activities);
        } catch (error) {
            logger('\nError in ActivityService.ts getClubActivities(): ' + error);
            return new ApiResponse(false, 'Error fetching activities', 500, null);
        }
    }

    public async updateActivityStatus(activityId: number, status: string): Promise<ApiResponse> {
        try {
            const activity = await this.prisma.activity.update({
                where: { id: activityId },
                data: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }
            });

            return new ApiResponse(true, 'Activity status updated successfully', 200, activity);
        } catch (error) {
            logger('\nError in ActivityService.ts updateActivityStatus(): ' + error);
            return new ApiResponse(false, 'Error updating activity status', 500, null);
        }
    }

    // Added missing methods that are used in the controller

    public async updateActivity(activityId: number, activityData: any): Promise<ApiResponse> {
        try {
            const activity = await this.prisma.activity.update({
                where: { id: activityId },
                data: activityData
            });

            return new ApiResponse(true, 'Activity updated successfully', 200, activity);
        } catch (error) {
            logger('\nError in ActivityService.ts updateActivity(): ' + error);
            return new ApiResponse(false, 'Error updating activity', 500, null);
        }
    }

    public async deleteActivity(activityId: number): Promise<ApiResponse> {
        try {
            await this.prisma.activity.delete({
                where: { id: activityId }
            });

            return new ApiResponse(true, 'Activity deleted successfully', 200, null);
        } catch (error) {
            logger('\nError in ActivityService.ts deleteActivity(): ' + error);
            return new ApiResponse(false, 'Error deleting activity', 500, null);
        }
    }

    public async getActivity(activityId: number): Promise<ApiResponse> {
        try {
            const activity = await this.prisma.activity.findUnique({
                where: { id: activityId }
            });

            if (!activity) {
                return new ApiResponse(false, 'Activity not found', 404, null);
            }

            return new ApiResponse(true, 'Activity fetched successfully', 200, activity);
        } catch (error) {
            logger('\nError in ActivityService.ts getActivity(): ' + error);
            return new ApiResponse(false, 'Error fetching activity', 500, null);
        }
    }

    public async getUpcomingActivities(page?: number, limit?: number): Promise<ApiResponse> {
        try {
            const skip = page && limit ? (page - 1) * limit : undefined;
            const take = limit || undefined;

            const activities = await this.prisma.activity.findMany({
                where: {
                    startDate: {
                        gte: new Date()
                    },
                    status: 'APPROVED'
                },
                orderBy: { startDate: 'asc' },
                skip,
                take
            });

            return new ApiResponse(true, 'Upcoming activities fetched successfully', 200, activities);
        } catch (error) {
            logger('\nError in ActivityService.ts getUpcomingActivities(): ' + error);
            return new ApiResponse(false, 'Error fetching upcoming activities', 500, null);
        }
    }
}