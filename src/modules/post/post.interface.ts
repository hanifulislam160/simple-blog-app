import { PostStatus } from "../../../generated/prisma/enums";

// import { PostStatus } from './post.interface';
export interface ICreatePostPayload {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  isFeatured: boolean;
  status: PostStatus;
  tags: string[];
}
