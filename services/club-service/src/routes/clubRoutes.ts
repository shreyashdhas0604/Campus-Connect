import { Router, Request, Response } from 'express';
import { ClubController } from '../controllers/ClubController';

const router = Router();
const clubController = new ClubController();

// Club Management Routes
router.get('/health', (req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: 'OK',
      message: 'Club Service is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Health check failed'
    });
  } 
});
router.post('/clubs', clubController.createClub);
router.put('/clubs/:id', clubController.updateClub);
router.get('/clubs/:id', clubController.getClub);
router.get('/search', clubController.searchClubs);
router.patch('/clubs/:id/status', clubController.updateClubStatus);

// Membership Management Routes
router.post('/memberships/join', clubController.joinClub);
router.post('/memberships/leave', clubController.leaveClub);
router.patch('/memberships/role', clubController.updateMemberRole);
router.get('/clubs/:clubId/members', clubController.getClubMembers);
router.get('/users/:userId/clubs', clubController.getUserClubs);

// Activity Management Routes
router.post('/activities', clubController.createActivity);
router.put('/activities/:id', clubController.updateActivity);
router.delete('/activities/:id', clubController.deleteActivity);
router.get('/activities/:id', clubController.getActivity);
router.get('/clubs/:clubId/activities', clubController.getClubActivities);
router.get('/activities/upcoming', clubController.getUpcomingActivities);

export default router;