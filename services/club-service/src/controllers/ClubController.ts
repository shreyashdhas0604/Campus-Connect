import { Request, Response } from 'express';
import { ClubService } from '../services/ClubService';
import { MembershipService } from '../services/MembershipService';
import { ActivityService } from '../services/ActivityService';
import { ClubStatus, ClubRole } from '@prisma/client';

export class ClubController {
    private clubService: ClubService;
    private membershipService: MembershipService;
    private activityService: ActivityService;

    constructor() {
        this.clubService = new ClubService();
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
        const result = await this.clubService.updateClub(id, req.body);
        res.status(result.statusCode).json(result);
    };

    public getClub = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.clubService.getClub(id);
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
        const result = await this.clubService.updateClubStatus(id, status as ClubStatus);
        res.status(result.statusCode).json(result);
    };

    // Membership Management
    public joinClub = async (req: Request, res: Response) => {
        const { userId, clubId } = req.body;
        const result = await this.membershipService.joinClub(userId, clubId);
        res.status(result.statusCode).json(result);
    };

    public leaveClub = async (req: Request, res: Response) => {
        const { userId, clubId } = req.body;
        const result = await this.membershipService.leaveClub(userId, clubId);
        res.status(result.statusCode).json(result);
    };

    public updateMemberRole = async (req: Request, res: Response) => {
        const { userId, clubId, role } = req.body;
        const result = await this.membershipService.updateMemberRole(userId, clubId, role as ClubRole);
        res.status(result.statusCode).json(result);
    };

    public getClubMembers = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const { page, limit } = req.query;
        const result = await this.membershipService.getClubMembers(
            clubId,
            Number(page),
            Number(limit)
        );
        res.status(result.statusCode).json(result);
    };

    public getUserClubs = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const result = await this.membershipService.getUserClubs(userId);
        res.status(result.statusCode).json(result);
    };

    // Activity Management
    public createActivity = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const result = await this.activityService.createActivity(clubId, req.body);
        res.status(result.statusCode).json(result);
    };

    public updateActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.updateActivity(id, req.body);
        res.status(result.statusCode).json(result);
    };

    public deleteActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.deleteActivity(id);
        res.status(result.statusCode).json(result);
    };

    public getActivity = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.activityService.getActivity(id);
        res.status(result.statusCode).json(result);
    };

    public getClubActivities = async (req: Request, res: Response) => {
        const { clubId } = req.params;
        const { page, limit } = req.query;
        const result = await this.activityService.getClubActivities(
            clubId,
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
}