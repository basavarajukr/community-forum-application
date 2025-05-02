import { Request, Response } from 'express';
import prisma from '../prisma'; 
import { AuthenticatedRequest } from '../types'; 
import { CreateCommentRequest, CommentResponse } from '../types'; 

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
    const { forumId } = req.params;
    const { content }: CreateCommentRequest = req.body;
  
    try {
      const forumIdNumber = parseInt(forumId);
  
      const forum = await prisma.forum.findUnique({
        where: { id: parseInt(forumId) },
        include: { tags: true },
      });
  
      if (!forum) {
        return res.status(404).json({ error: 'Forum not found' });
      }
  
      const comment = await prisma.comment.create({
        data: {
          content,
          forumId: forumIdNumber,
          userId: req.user.id,
        },
      });
  
      const commentResponse: CommentResponse = {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        user: {
          id: comment.userId,
          name: req.user.name || '', 
        },
        forum: {
          id: forum.id,
          title: forum.title,
        },
      };
  
      res.status(201).json(commentResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getCommentsByForum = async (req: Request, res: Response) => {
  const { forumId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { forumId: parseInt(forumId) },
      include: {
        user: { select: { id: true, name: true } }, 
        forum: true, 
      },
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ error: 'No comments found for this forum' });
    }

    const commentResponses: CommentResponse[] = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.userId,
        name: comment.user.name || '',
      },
      forum: {
        id: comment.forum.id,
        title: comment.forum.title,
      },
    }));

    res.status(200).json(commentResponses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
