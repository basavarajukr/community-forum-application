import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import forumRoutes from './src/routes/forumRoutes';
import authRoutes from './src/routes/authRoutes';
import passport from './src/middleware/passport';
import userRoutes from './src/routes/userRoutes';
import commentRoutes from './src/routes/commentRoutes';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/comments', commentRoutes);


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
