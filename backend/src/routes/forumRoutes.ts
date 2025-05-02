import express from 'express';
import passport from '../middleware/passport'; 
import { createForum, updateForum, deleteForum, getAllForums, getSingleForum } from '../controllers/forumController';

const router = express.Router();

router.post(
  '/forums',
  passport.authenticate('jwt', { session: false }), 
  createForum
);

router.put(
  '/forums/:forumId',
  passport.authenticate('jwt', { session: false }), 
  updateForum
);

router.delete(
  '/forums/:forumId',
  passport.authenticate('jwt', { session: false }), 
  deleteForum
);

router.get('/forums', getAllForums);
router.get('/forums/:forumId', getSingleForum);


export default router;
