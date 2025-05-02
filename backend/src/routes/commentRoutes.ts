import { Router } from 'express';
import { createComment, deleteComment, getCommentsByForum } from '../controllers/commentController';
import passport from 'passport';

const router = Router();

router.post(
  '/forums/:forumId',
  passport.authenticate('jwt', { session: false }), 
  createComment
);

router.delete(
  '/:commentId',
  passport.authenticate('jwt', { session: false }), 
  deleteComment
);

router.get('/forums/:forumId', getCommentsByForum);

export default router;
