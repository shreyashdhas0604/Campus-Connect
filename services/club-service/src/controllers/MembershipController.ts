import { Request, Response } from 'express';
import { MembershipService } from '../services/MembershipService';
import { parse } from 'dotenv';

export class MembershipController {
    private membershipService: MembershipService;

    constructor() {
        this.membershipService = new MembershipService();
    }

    public joinClub = async (req: Request, res: Response): Promise<void> => {
        const { clubId } = req.params;
        const { userId } = req.body;
        const response = await this.membershipService.joinClub(userId, parseInt(clubId));
        res.status(response.statusCode).json(response);
    };

    public getClubMembers = async (req: Request, res: Response): Promise<void> => {
        const { clubId } = req.params;
        const response = await this.membershipService.getClubMembers(parseInt(clubId));
        res.status(response.statusCode).json(response);
    };

    public updateMemberRole = async (req: Request, res: Response): Promise<void> => {
        const { clubId, userId } = req.params;
        const { role } = req.body;
        const response = await this.membershipService.updateMemberRole(parseInt(userId), parseInt(clubId), role);
        res.status(response.statusCode).json(response);
    };

    public removeMember = async (req: Request, res: Response): Promise<void> => {
        const { clubId, userId } = req.params;
        const response = await this.membershipService.removeMember(parseInt(userId), parseInt(clubId));
        res.status(response.statusCode).json(response);
    };
}