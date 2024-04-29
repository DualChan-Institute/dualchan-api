import {z} from 'zod';
import {IdZ} from '../generic/Id';

export const CommentZ = z.object({
  parentId: z.string(),
  authorId: z.string(),
  title: z.string().optional(),
  text: z.string(),
  votes: z.number().int(),
});

export const CommentDocumentZ = CommentZ.merge(IdZ);

// Type for creation, update
export type Comment = z.infer<typeof CommentZ>;

// Type for get
export type CommentDocument = z.infer<typeof CommentDocumentZ>;
