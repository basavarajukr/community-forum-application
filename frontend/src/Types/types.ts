export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface Forum {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  user: User;
  tags: Tag[];
  comments: Comment[];
}

export interface AuthState {
    token: string | null;
    user: User | null;
  }