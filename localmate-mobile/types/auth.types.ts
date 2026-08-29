export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  nationality?: string;
  role: 'TOURIST' | 'GUIDE' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  nationality?: string;
  role: 'TOURIST' | 'GUIDE';
}
