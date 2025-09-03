import express from 'express'
import { getRecommendedUser , getMyFriends , sendFriendRequest , acceptFriendRequest , getOutGoingFriendRequest ,getFriendRequests} from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middle.js';

const router = express.Router()

//instead of applying to each route you can just apply to all middleware, 
router.use(protectRoute)

router.get('/',getRecommendedUser);
router.get('/friends',getMyFriends)

router.post('/friend-request/:id',sendFriendRequest);
router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friend-requests', getFriendRequests)
router.get('/out-friend-requests',getOutGoingFriendRequest)

export default router 