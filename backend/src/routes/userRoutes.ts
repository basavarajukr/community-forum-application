import { Router } from 'express';
import passport from '../middleware/passport'; 
import { getUserProfile } from '../controllers/userController';

const router = Router();

router.get('/profile', passport.authenticate('jwt', { session: false }), getUserProfile);

export default router;
