/**
 * Common model types inferred from backend server models/*
 * (user, feature, featureUser - used by CRCWeb)
 */

export interface User {
  id: number;
  username: string;
  email: string;
  password: string | null;
  firstName: string;
  lastName: string;
  avatar: string | null;
  token: string | null;
  loginType: string | null;
  isBot: boolean;
  featureUsers?: FeatureUser[];
}

export interface Feature {
  id: number;
  name: string;
  description: string | null;
  allowSignup: boolean;
}

export interface FeatureUser {
  id: number;
  role: string;
  status: string | null;
}

export interface UserPair {
  id?: number;
  [key: string]: unknown;
}
