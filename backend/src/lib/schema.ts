import z from "zod";

export const researchTopicSchema = z.object({
  topic: z.string().min(1, "Enter a valid topic").trim(),
});
