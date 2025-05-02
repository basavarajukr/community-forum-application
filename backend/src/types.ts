import { Request } from 'express';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name?: string | null;  
  };
}

export interface ErrorResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface CreateForumRequest {
  title: string;
  description: string;
  tags?: string[]; 
}

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthenticatedRequest extends Request {
  user: User; 
}

export interface ForumResponse {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  tags: { id: number; name: string }[];
  comments?: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }[];
}

export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
  forum: {
    id: number;
    title: string;
  };
}
