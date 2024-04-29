import {z} from 'zod';

// both limit and offset are optional or have to be both present
export const PaginationZ = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().positive().optional(),
});
//   .refine(
//     (data) => {
//       return data.limit !== undefined && data.offset !== undefined;
//     },
//     {
//       message: 'limit and offset must be both present or both absent',
//     },
//   );
