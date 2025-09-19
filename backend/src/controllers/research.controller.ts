import { type Response, type Request } from "express";
import { researchTopicSchema } from "../lib/schema";
import z, { success } from "zod";
import prisma from "../lib/prisma";

export const newTopicResearch = async (req: Request, res: Response) => {
  const { data, success } = researchTopicSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      errors: z.treeifyError,
      message: "Invalid Topic",
    });
  }

  const { topic } = data;

  try {
    const newJob = await prisma.researchJob.create({
      data: {
        topic,
        status: "PENDING",
      },
    });

    res.status(202).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create job",
    });
  }
};

export const getAllResearch = async (req: Request, res: Response) => {
  try {
    const allSearch = await prisma.researchJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        topic: true,
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      data: allSearch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch research jobs",
    });
  }
};

export const getSpecificResearch = () => {};
