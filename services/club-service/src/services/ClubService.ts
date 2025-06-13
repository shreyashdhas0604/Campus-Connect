import { PrismaClient } from '@prisma/client';
import type { Club, ClubStatus } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';
import { sendMessage } from '../kafka/producer';

export class ClubService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createClub(clubData: any): Promise<ApiResponse> {
        try {
            // Log the received data
            console.log('Received club data:', clubData);

            // Validate required fields
            if (!clubData.name || !clubData.description || !clubData.category) {
                return new ApiResponse(false, 'Missing required fields', 400, null);
            }

            const club = await this.prisma.club.create({
                data: {
                    name: clubData.name,
                    description: clubData.description,
                    category: clubData.category,
                    meetingLocation: clubData.meetingLocation,
                    image: clubData.image || null,
                    status: 'ACTIVE'
                }
            });

            await sendMessage('club-created', {
                clubId: club.id,
                name: club.name,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Club created successfully', 201, club);
        } catch (error) {
            logger('\nError in ClubService.ts createClub(): ' + error);
            return new ApiResponse(false, 'Error creating club', 500, null);
        }
    }

    public async updateClub(id: number, clubData: Partial<Club>): Promise<ApiResponse> {
        try {
            const club = await this.prisma.club.update({
                where: { id },
                data: clubData
            });

            await sendMessage('club-updated', {
                clubId: club.id,
                updates: clubData,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Club updated successfully', 200, club);
        } catch (error) {
            logger('\nError in ClubService.ts updateClub(): ' + error);
            return new ApiResponse(false, 'Error updating club', 500, null);
        }
    }

    public async getClub(id: number): Promise<ApiResponse> {
        try {
            const club = await this.prisma.club.findUnique({
                where: { id },
                include: {
                    memberships: true,
                    activities: true
                }
            });

            if (!club) {
                return new ApiResponse(false, 'Club not found', 404, null);
            }

            return new ApiResponse(true, 'Club found successfully', 200, club);
        } catch (error) {
            logger('\nError in ClubService.ts getClub(): ' + error);
            return new ApiResponse(false, 'Error fetching club', 500, null);
        }
    }

    public async searchClubs(searchParams: any): Promise<ApiResponse> {
        try {
            const { name, status, page = 1, limit = 10 } = searchParams;
            const skip = (page - 1) * limit;

            const whereClause: any = {};
            if (name) whereClause.name = { contains: name, mode: 'insensitive' };
            if (status) whereClause.status = status;

            const totalCount = await this.prisma.club.count({
                where: whereClause
            });

            const clubs = await this.prisma.club.findMany({
                where: whereClause,
                include: {
                    memberships: true,
                    activities: true
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            const totalPages = Math.ceil(totalCount / limit);

            return new ApiResponse(true, 'Clubs found successfully', 200, {
                clubs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            logger('\nError in ClubService.ts searchClubs(): ' + error);
            return new ApiResponse(false, 'Error searching clubs', 500, null);
        }
    }

    public async updateClubStatus(id: number, status: ClubStatus): Promise<ApiResponse> {
        try {
            const club = await this.prisma.club.update({
                where: { id },
                data: { status }
            });

            await sendMessage('club-status-updated', {
                clubId: club.id,
                status: status,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Club status updated successfully', 200, club);
        } catch (error) {
            logger('\nError in ClubService.ts updateClubStatus(): ' + error);
            return new ApiResponse(false, 'Error updating club status', 500, null);
        }
    }

    public async deleteClub(id: number): Promise<ApiResponse> {
        try {
            const club = await this.prisma.club.delete({
                where: { id }
            });

            if (!club) {
                return new ApiResponse(false, 'Club not found', 404, null); 
            }

            console.log('Club deleted successfully'); // Log the successful deletion messag

            await sendMessage('club-deleted', {
                clubId: club.id,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Club deleted successfully', 200, club);

        } 
        catch (error) {
            logger('\nError in ClubService.ts deleteClub():'+ error);
            return new ApiResponse(false, 'Error deleting club', 500, null); 
        }
    }

}