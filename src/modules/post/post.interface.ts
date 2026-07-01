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
  //   views: bigint | number;
  //   authorId: string;

  // Relations (Optional depending on your API payloads)
  //   author?: IUser;
  //   comments?: IComment[];

  //   createdAt: Date;
  //   updatedAt: Date;
}

// Enum for Post Status
// export enum PostStatus {
//   DRAFT = "DRAFT",
//   PUBLISHED = "PUBLISHED",
//   // Add other statuses matching your database enum here
// }
