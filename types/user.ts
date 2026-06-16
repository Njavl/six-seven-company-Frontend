export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  followers: string[];
  following: string[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}
