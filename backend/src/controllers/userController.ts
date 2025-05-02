import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number };  
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
