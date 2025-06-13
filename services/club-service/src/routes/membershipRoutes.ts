import { Router } from 'express';
import { MembershipController } from '../controllers/MembershipController';

const router = Router();
const membershipController = new MembershipController();

router.post('/clubs/:clubId/members', membershipController.joinClub);
router.get('/clubs/:clubId/members', membershipController.getClubMembers);
router.patch('/clubs/:clubId/members/:userId/role', membershipController.updateMemberRole);
router.delete('/clubs/:clubId/members/:userId', membershipController.removeMember);
router.get('/clubs/:clubId/members/:userId/role', membershipController.getMemberRole);

export default router;