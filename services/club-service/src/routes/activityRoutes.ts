import { Router } from 'express';
import { ActivityController } from '../controllers/ActivityController';
import { validateActivityRequest } from '../middleware/validateRequest';

const router = Router();
const activityController = new ActivityController();

router.post('/clubs/:clubId/activities', validateActivityRequest, activityController.createActivity);
router.get('/clubs/:clubId/activities', activityController.getClubActivities);
router.patch('/clubs/:clubId/activities/:activityId', activityController.updateActivityStatus);

export default router;