import { ClubService } from '../services/ClubService';
import { MembershipService } from '../services/MembershipService';
import { ActivityService } from '../services/ActivityService';
import logger from '../utils/logger';

const clubService = new ClubService();
const membershipService = new MembershipService();
const activityService = new ActivityService();

export const handleMessage = async (topic: string, message: any) => {
    try {
        switch (topic) {
            case 'club-events':
                await handleClubEvent(message);
                break;
            case 'membership-events':
                await handleMembershipEvent(message);
                break;
            case 'activity-events':
                await handleActivityEvent(message);
                break;
            default:
                logger(`Unhandled topic: ${topic}`);
        }
    } catch (error) {
        logger(`Error handling message for topic ${topic}: ${error}`);
    }
};

const handleClubEvent = async (message: any) => {
    switch (message.type) {
        case 'UPDATE_STATUS':
            await clubService.updateClubStatus(message.clubId, message.status);
            break;
        // Add more club event handlers as needed
    }
};

const handleMembershipEvent = async (message: any) => {
    switch (message.type) {
        case 'UPDATE_ROLE':
            await membershipService.updateMemberRole(message.userId, message.clubId, message.role);
            break;
        // Add more membership event handlers as needed
    }
};

const handleActivityEvent = async (message: any) => {
    switch (message.type) {
        case 'UPDATE_STATUS':
            await activityService.updateActivityStatus(message.activityId, message.status);
            break;
        // Add more activity event handlers as needed
    }
};