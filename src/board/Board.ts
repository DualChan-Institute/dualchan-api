import {z} from 'zod';
import {IdZ} from '../generic/Id';

export const BoardZ = z.object({
  name: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
});

export const BoardDocumentZ = BoardZ.merge(IdZ);

// Type for creation, update
export type Board = z.infer<typeof BoardZ>;

// Type for get
export type BoardDocument = z.infer<typeof BoardDocumentZ>;
