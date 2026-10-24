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

export type PostAuthor = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type Post = {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FeedData = {
  items: Post[];
  pagination: Pagination;
};

export type UserListItem = PostAuthor & {
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
};

export type UserListData = {
  users: UserListItem[];
  pagination: Pagination;
};
