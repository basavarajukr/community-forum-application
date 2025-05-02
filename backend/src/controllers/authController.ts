// authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RegisterRequest, RegisterResponse, ErrorResponse } from '../types';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const registerUser = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response<RegisterResponse | ErrorResponse>
): Promise<Response> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const response: RegisterResponse = {
      message: 'User registered successfully!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name || 'Test', 
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error during registration:', error);
    const errorResponse: ErrorResponse = { message: 'Internal server error.' };
    return res.status(500).json(errorResponse);
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<LoginResponse | ErrorResponse>
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const response: LoginResponse = {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || 'Test',
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error during login:', error);
    const errorResponse: ErrorResponse = { message: 'Internal server error.' };
    return res.status(500).json(errorResponse);
  }
};