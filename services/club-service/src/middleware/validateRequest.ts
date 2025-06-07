import { Request, Response, NextFunction } from 'express';

export const validateActivityRequest = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const { title, description, startDate, endDate } = req.body;
    
    if (!title || !description || !startDate) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields',
            statusCode: 400,
            data: null
        });
        return;
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
        res.status(400).json({
            success: false,
            message: 'End date cannot be before start date',
            statusCode: 400,
            data: null
        });
        return;
    }

    next();
};