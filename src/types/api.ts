export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
};

export type AuthData = {
  token: string;
  user: User;
};

export type Profile = User & {
  bio: string | null;
  createdAt: string;
};

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

export type MeData = {
  profile: Profile;
  stats: ProfileStats;
};
