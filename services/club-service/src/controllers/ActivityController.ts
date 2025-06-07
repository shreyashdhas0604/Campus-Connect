import { Request, Response } from 'express';
import { ActivityService } from '../services/ActivityService';

export class ActivityController {
    private activityService: ActivityService;

    constructor() {
        this.activityService = new ActivityService();
    }

    public createActivity = async (req: Request, res: Response): Promise<void> => {
        const { clubId } = req.params;
        const response = await this.activityService.createActivity(clubId, req.body);
        res.status(response.statusCode).json(response);
    };

    public getClubActivities = async (req: Request, res: Response): Promise<void> => {
        const { clubId } = req.params;
        const response = await this.activityService.getClubActivities(clubId);
        res.status(response.statusCode).json(response);
    };

    public updateActivityStatus = async (req: Request, res: Response): Promise<void> => {
        const { activityId } = req.params;
        const { status } = req.body;
        const response = await this.activityService.updateActivityStatus(activityId, status);
        res.status(response.statusCode).json(response);
    };
}