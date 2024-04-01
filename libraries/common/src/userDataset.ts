import z from "zod";

export interface UserDataset {
  timestamp: number;
  userId: number;
  epilogDataset: string | null;
}

export const userIdSchema = z.number({ coerce: true });

export const setUserDatasetDtoSchema = z.object({
  epilogDataset: z.string(),
});

export type SetUserDatasetDto = z.infer<typeof setUserDatasetDtoSchema>;
