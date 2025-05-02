import { Request, Response } from 'express';
import { CreateForumRequest, ForumResponse, AuthenticatedRequest } from '../types'; 
import prisma from '../prisma'; 

export const createForum = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, tags }: CreateForumRequest = req.body;

  try {
    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        tags: {
          connectOrCreate: tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        userId: req.user.id,
      },
    });

    const fullForum = await prisma.forum.findUnique({
      where: { id: forum.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tags: true,
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(201).json(fullForum as ForumResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export const updateForum = async (req: AuthenticatedRequest, res: Response) => {
  const { forumId } = req.params;
  const { title, description, tags }: CreateForumRequest = req.body;

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: parseInt(forumId) },
      include: { tags: true },
    });

    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (forum.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this forum' });
    }

    await prisma.forum.update({
      where: { id: parseInt(forumId) },
      data: {
        title,
        description,
        tags: {
          disconnect: forum.tags.map((tag) => ({ id: tag.id })),
          connectOrCreate: tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    const updatedForum = await prisma.forum.findUnique({
      where: { id: parseInt(forumId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tags: true,
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(200).json(updatedForum as ForumResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};



export const deleteForum = async (req: AuthenticatedRequest, res: Response) => {
  const { forumId } = req.params;

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: parseInt(forumId) },
    });

    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    if (forum.userId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this forum' });
    }

    await prisma.forum.delete({
      where: { id: parseInt(forumId) },
    });

    res.status(200).json({ message: 'Forum deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getAllForums = async (req: Request, res: Response) => {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(forums as ForumResponse[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching forums' });
  }
};

export const getSingleForum = async (req: Request, res: Response) => {
  const { forumId } = req.params;

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: parseInt(forumId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tags: true,
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    res.status(200).json(forum as ForumResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching forum' });
  }
};