import { ClubRole, Membership, PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';
import { sendMessage } from '../kafka/producer';

export class MembershipService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async joinClub(userId: string, clubId: string): Promise<ApiResponse> {
        try {
            const existingMembership = await this.prisma.membership.findUnique({
                where: {
                    userId_clubId: {
                        userId,
                        clubId
                    }
                }
            });

            if (existingMembership) {
                return new ApiResponse(false, 'User is already a member of this club', 400, null);
            }

            const membership = await this.prisma.membership.create({
                data: {
                    userId,
                    clubId,
                    role: ClubRole.MEMBER
                },
                include: {
                    club: true
                }
            });

            await sendMessage('club-member-joined', {
                userId,
                clubId,
                clubName: membership.club.name,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Successfully joined the club', 201, membership);
        } catch (error) {
            logger('\nError in MembershipService.ts joinClub(): ' + error);
            return new ApiResponse(false, 'Error joining club', 500, null);
        }
    }

    public async leaveClub(userId: string, clubId: string): Promise<ApiResponse> {
        try {
            const membership = await this.prisma.membership.findUnique({
                where: {
                    userId_clubId: {
                        userId,
                        clubId
                    }
                },
                include: {
                    club: true
                }
            });

            if (!membership) {
                return new ApiResponse(false, 'User is not a member of this club', 404, null);
            }

            if (membership.role === ClubRole.PRESIDENT) {
                return new ApiResponse(false, 'Club president cannot leave the club', 400, null);
            }

            await this.prisma.membership.delete({
                where: {
                    userId_clubId: {
                        userId,
                        clubId
                    }
                }
            });

            await sendMessage('club-member-left', {
                userId,
                clubId,
                clubName: membership.club.name,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Successfully left the club', 200, null);
        } catch (error) {
            logger('\nError in MembershipService.ts leaveClub(): ' + error);
            return new ApiResponse(false, 'Error leaving club', 500, null);
        }
    }

    public async updateMemberRole(userId: string, clubId: string, newRole: ClubRole): Promise<ApiResponse> {
        try {
            const membership = await this.prisma.membership.update({
                where: {
                    userId_clubId: {
                        userId,
                        clubId
                    }
                },
                data: {
                    role: newRole
                },
                include: {
                    club: true
                }
            });

            await sendMessage('club-member-role-updated', {
                userId,
                clubId,
                clubName: membership.club.name,
                newRole,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Member role updated successfully', 200, membership);
        } catch (error) {
            logger('\nError in MembershipService.ts updateMemberRole(): ' + error);
            return new ApiResponse(false, 'Error updating member role', 500, null);
        }
    }

    public async getClubMembers(clubId: string, page: number = 1, limit: number = 10): Promise<ApiResponse> {
        try {
            const skip = (page - 1) * limit;

            const totalCount = await this.prisma.membership.count({
                where: { clubId }
            });

            const members = await this.prisma.membership.findMany({
                where: { clubId },
                skip,
                take: limit,
                orderBy: {
                    joinedAt: 'desc'
                }
            });

            const totalPages = Math.ceil(totalCount / limit);

            return new ApiResponse(true, 'Club members retrieved successfully', 200, {
                members,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            logger('\nError in MembershipService.ts getClubMembers(): ' + error);
            return new ApiResponse(false, 'Error retrieving club members', 500, null);
        }
    }

    public async getUserClubs(userId: string): Promise<ApiResponse> {
        try {
            const memberships = await this.prisma.membership.findMany({
                where: { userId },
                include: {
                    club: true
                }
            });

            return new ApiResponse(true, 'User clubs retrieved successfully', 200, memberships);
        } catch (error) {
            logger('\nError in MembershipService.ts getUserClubs(): ' + error);
            return new ApiResponse(false, 'Error retrieving user clubs', 500, null);
        }
    }

    public async removeMember(userId: string, clubId: string): Promise<ApiResponse> {
        try {
            const membership = await this.prisma.membership.delete({
                where: {
                    userId_clubId: {
                        userId,
                        clubId
                    }
                }
            });

            await sendMessage('club-member-removed', {
                userId,
                clubId,
                timestamp: new Date().toISOString()
            });

            return new ApiResponse(true, 'Member removed successfully', 200, membership);
        } catch (error) {
            logger('\nError in MembershipService.ts removeMember(): ' + error);
            return new ApiResponse(false, 'Error removing member', 500, null);
        }
    }
}