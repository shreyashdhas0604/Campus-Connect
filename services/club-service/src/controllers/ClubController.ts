import { Request, Response } from 'express';
import { MembershipService } from '../services/MembershipService';
import { ActivityService } from '../services/ActivityService';
import { ClubService } from '../services/ClubService';
import { ClubStatus, ClubRole } from '@prisma/client';

export class ClubController {
    private clubService: ClubService;
    private membershipService: MembershipService;
    private activityService: ActivityService;

    constructor() {
        this.clubService = new ClubService(); // Ensure this is instantiated
        this.membershipService = new MembershipService();
        this.activityService = new ActivityService();
    }

    // Club Management
    public createClub = async (req: Request, res: Response) => {
        const result = await this.clubService.createClub(req.body);
        res.status(result.statusCode).json(result);
    };

    public updateClub = async (req: Request, res: Response) => {
        const { id } = req.params;
        const id1 = parseInt(id);
        const result = await this.clubService.updateClub(id1, req.body);
        res.status(result.statusCode).json(result);
    };

    public getClub = async (req: Request, res: Response) => {
        const { id } = req.params;
        const id1 = parseInt(id);
        const result = await this.clubService.getClub(id1);
        res.status(result.statusCode).json(result);
    };

    public searchClubs = async (req: Request, res: Response) => {
        console.log("Search query received:", req.query);
        const result = await this.clubService.searchClubs(req.query);
        console.log("Response in the searchClubs controller : ",result);
        res.status(result.statusCode).json(result);
    };

    public updateClubStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        const result = await this.clubService.updateClubStatus(parseInt(id), status as ClubStatus);
        res.status(result.statusCode).json(result);
    };

    // Membership Management
    public joinClub = async (req: Request, res: Response) => {
        const { userId, clubId } = req.body;
        const result = await this.membershipService.joinClub(parseInt(clubId), parseInt(userId));
        res.status(result.statusCode).json(result);
    };

    public leaveClub = async (req: Request, res: Response) => {
        const { userId, clubId } = req.body;
        const result = await this.membershipService.leaveClub(parseInt(userId), parseInt(clubId));
        res.status(result.statusCode).json(result);
    };

    public updateMemberRole = async (req: Request, res: Response) => {
        const { userId, clubId, role } = req.body;
        const result = await this.membershipService.updateMemberRole(parseInt(userId), parseInt(clubId), role as ClubRole);
        res.status(result.statusCode).json(result);
    };

    public getClubMembers = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const { page, limit } = req.query;
        const result = await this.membershipService.getClubMembers(
            parseInt(clubId),
            Number(page),
            Number(limit)
        );
        res.status(result.statusCode).json(result);
    };

    public getUserClubs = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const result = await this.membershipService.getUserClubs(parseInt(userId));
        res.status(result.statusCode).json(result);
    };

    // Activity Management
    public createActivity = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const result = await this.activityService.createActivity(parseInt(clubId), req.body);
        res.status(result.statusCode).json(result);
    };

    public updateActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.updateActivity(parseInt(id), req.body);
        res.status(result.statusCode).json(result);
    };

    public deleteActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.deleteActivity(parseInt(id));
        res.status(result.statusCode).json(result);
    };

    public getActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.getActivity(parseInt(id));
        res.status(result.statusCode).json(result);
    };

    public getClubActivities = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const { page, limit } = req.query;
        const result = await this.activityService.getClubActivities(
            parseInt(clubId),
            page ? Number(page) : undefined,
            limit ? Number(limit) : undefined
        );
        res.status(result.statusCode).json(result);
    };

    public getUpcomingActivities = async (req: Request, res: Response) => {
        const { page, limit } = req.query;
        const result = await this.activityService.getUpcomingActivities(
            page ? Number(page) : undefined,
            limit ? Number(limit) : undefined
        );
        res.status(result.statusCode).json(result);
    };

    // public async removeMember(req: Request, res: Response) {
    //     const { id } = req.params;
    //     const { userId } = req.body;
    //     const result = await this.membershipService.removeMember(parseInt(id), userId);
    //     res.status(result.statusCode).json(result); 
    // }

    public removeMember = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { userId } = req.body;
        const result = await this.membershipService.removeMember(parseInt(id), userId);
        res.status(result.statusCode).json(result);
    };

    // public async deleteClub(req: Request, res: Response) {
    //     const { id } = req.params;
    //     const result = await this.clubService.deleteClub(parseInt(id));
    //     console.log("result in deleteClub controller : ",result);
    //     res.status(result.statusCode).json(result);
    // }

    public deleteClub = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.clubService.deleteClub(parseInt(id));
        res.status(result.statusCode).json(result);
    };

    public updateMemberRoleById = async (req: Request, res: Response) => {
        const {  clubId, role,memberId } = req.body;
        const result = await this.membershipService.updateMemberRoleById(parseInt(memberId), role as ClubRole);
        res.status(result.statusCode).json(result);
    };
}